---
name: drift-duasaku-migrations
description: Drift database migration safety protocols for DuaSaku. Enforces schema versioning, migration guards, backup requirements, and code generation workflow. Use when modifying database schema.
when_to_use: "When adding/modifying Drift tables, columns, or constraints in DuaSaku. Enforces migration safety, data backup for destructive ops, and version increments. NOT for general Drift projects."
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# Drift DuaSaku Migration Protocols

> **Philosophy:** Never lose user data. Every migration is reversible and tested.
> **Core Principle:** Backup before destroy. Version before change. Test before deploy.

---

## 🔴 CRITICAL: Pre-Migration Checklist

Before modifying ANY Drift table or column:

- [ ] Read current `schemaVersion` in `AppDatabase`
- [ ] Plan migration step with `if (from < N)` guard
- [ ] Identify if migration is destructive (drop table/column)
- [ ] If destructive → Plan data backup strategy FIRST
- [ ] Write migration code in `onUpgrade`
- [ ] Increment `schemaVersion` by 1
- [ ] Run `flutter pub run build_runner build --delete-conflicting-outputs`
- [ ] Test migration with old DB version
- [ ] Never modify existing migration steps

---

## 📊 Schema Version Management

### Current Version Location
```dart
// lib/core/local_db/database.dart
@DriftDatabase(tables: [Transactions, Wallets, Categories, Budgets])
class AppDatabase extends _$AppDatabase {
  @override
  int get schemaVersion => 5; // ← INCREMENT THIS
  
  @override
  MigrationStrategy get migration => MigrationStrategy(
    onCreate: (m) async {
      await m.createAll();
    },
    onUpgrade: (m, from, to) async {
      // Migration steps here
    },
  );
}
```

### Version Increment Rule

**MANDATORY:** Increment `schemaVersion` for EVERY schema change:

```dart
// ✅ CORRECT - Increment by 1
int get schemaVersion => 6; // Was 5, now 6

// ❌ WRONG - Skip numbers or stay same
int get schemaVersion => 5; // Forgot to increment
int get schemaVersion => 7; // Skipped 6
```

---

## 🛡️ Migration Guard Pattern

### Standard Guard Structure

**ALWAYS use `if (from < N)` guard:**

```dart
@override
MigrationStrategy get migration => MigrationStrategy(
  onUpgrade: (m, from, to) async {
    // ✅ CORRECT - Each version has its own guard
    if (from < 2) {
      await m.createTable(budgets);
    }
    if (from < 3) {
      await m.addColumn(budgets, budgets.userId);
    }
    if (from < 4) {
      await m.createIndex(idxTransactionsUserDate);
    }
    if (from < 5) {
      await m.addColumn(transactions, transactions.notes);
    }
    // New migrations go here
    if (from < 6) {
      // Your new migration
    }
  },
);
```

### Why Guards Are Critical

```dart
// ❌ WRONG - No guards
onUpgrade: (m, from, to) async {
  await m.addColumn(transactions, transactions.notes);
  // This runs for EVERY upgrade, even if column exists!
}

// ✅ CORRECT - Guard ensures idempotency
onUpgrade: (m, from, to) async {
  if (from < 5) {
    await m.addColumn(transactions, transactions.notes);
    // Only runs when upgrading from version < 5
  }
}
```

**Rule:** Guards make migrations idempotent and allow skipping versions (e.g., v1 → v6 directly).

---

## 🚨 Destructive Migrations (CRITICAL)

### What is Destructive?

Operations that **delete data** or **change structure** irreversibly:
- ❌ `m.deleteTable('old_table')`
- ❌ `m.drop('old_column')`
- ❌ Renaming tables/columns (SQLite limitation)
- ❌ Changing column type (requires recreate)

### Mandatory Backup Protocol

**BEFORE any destructive operation, backup data:**

```dart
if (from < 6) {
  // DESTRUCTIVE: Dropping old_transactions table
  
  // ✅ STEP 1: BACKUP DATA FIRST
  final rows = await customSelect('SELECT * FROM old_transactions').get();
  
  // ✅ STEP 2: INSERT INTO NEW STRUCTURE
  for (final row in rows) {
    await into(transactions).insert(TransactionsCompanion.insert(
      description: row.read<String>('description'),
      amount: row.read<double>('amount'),
      walletId: row.read<int>('wallet_id'),
      categoryType: row.read<int>('category_type'),
      createdAt: row.read<DateTime>('created_at'),
      // Map all columns
    ));
  }
  
  // ✅ STEP 3: VERIFY BACKUP (optional but recommended)
  final backupCount = await (select(transactions).get()).then((t) => t.length);
  if (backupCount != rows.length) {
    throw Exception('Migration failed: backup count mismatch');
  }
  
  // ✅ STEP 4: DROP ONLY AFTER BACKUP SUCCEEDS
  await m.deleteTable('old_transactions');
}
```

### Column Rename Pattern (SQLite Limitation)

SQLite doesn't support `RENAME COLUMN` directly. Use this pattern:

```dart
if (from < 7) {
  // Renaming 'category' to 'category_type'
  
  // 1. Add new column
  await m.addColumn(transactions, transactions.categoryType);
  
  // 2. Copy data from old column
  await customUpdate(
    'UPDATE transactions SET category_type = category',
  );
  
  // 3. Drop old column (requires table recreate in SQLite)
  // NOTE: Drift handles this automatically with m.recreateTable
  await m.recreateTable(transactions);
}
```

---

## 📝 Common Migration Operations

### 1. Add New Table

```dart
if (from < 6) {
  await m.createTable(newTable);
}
```

### 2. Add New Column

```dart
if (from < 6) {
  await m.addColumn(transactions, transactions.notes);
}
```

**With Default Value:**
```dart
if (from < 6) {
  // Column must have default in table definition
  await m.addColumn(transactions, transactions.isArchived);
  // Table definition: BoolColumn get isArchived => boolean().withDefault(const Constant(false))();
}
```

### 3. Create Index

```dart
if (from < 6) {
  await m.createIndex(idxTransactionsUserDate);
}
```

### 4. Add Foreign Key (Requires Table Recreate)

```dart
if (from < 6) {
  // Foreign keys require recreating table in SQLite
  await m.recreateTable(transactions);
}
```

### 5. Change Column Type (Requires Backup)

```dart
if (from < 6) {
  // Changing amount from INTEGER to REAL
  
  // 1. Backup data
  final rows = await customSelect('SELECT * FROM transactions').get();
  
  // 2. Drop table
  await m.deleteTable('transactions');
  
  // 3. Recreate with new type
  await m.createTable(transactions);
  
  // 4. Restore data with type conversion
  for (final row in rows) {
    await into(transactions).insert(TransactionsCompanion.insert(
      amount: row.read<int>('amount').toDouble(), // Convert type
      // ... other fields
    ));
  }
}
```

---

## 🔄 Code Generation Workflow

### After EVERY Schema Change:

```bash
# 1. Modify table class in lib/core/local_db/tables/
# Example: Add new column to Transactions table

# 2. Run build_runner
flutter pub run build_runner build --delete-conflicting-outputs

# 3. Increment schemaVersion
# Update AppDatabase.schemaVersion

# 4. Add migration step
# Add if (from < N) block in onUpgrade

# 5. Test migration
flutter test test/database/migrations_test.dart

# 6. Run app
flutter run
```

### What Gets Generated:

```
lib/core/local_db/
├── database.dart
├── database.g.dart       ← Generated, DON'T EDIT
├── tables/
│   ├── transactions.dart
│   └── wallets.dart
└── daos/
    ├── transaction_dao.dart
    └── transaction_dao.g.dart  ← Generated, DON'T EDIT
```

**NEVER edit `.g.dart` files manually!**

---

## 🧪 Migration Testing Protocol

### Test Old → New Version Upgrade

```dart
// test/database/migrations_test.dart
void main() {
  late SchemaVerifier verifier;

  setUpAll(() {
    verifier = SchemaVerifier(GeneratedHelper());
  });

  test('upgrade from v5 to v6', () async {
    // 1. Create DB at old version
    final schema = await verifier.schemaAt(5);
    final oldDb = DatabaseAtV5(schema.newConnection());
    
    // 2. Insert test data
    await oldDb.into(oldDb.transactions).insert(
      TransactionsCompanion.insert(
        description: 'Test transaction',
        amount: 50000.0,
        walletId: 1,
      ),
    );
    await oldDb.close();
    
    // 3. Migrate to new version
    final db = AppDatabase(schema.newConnection());
    await verifier.migrateAndValidate(db, 6);
    
    // 4. Verify data survived migration
    final transactions = await db.select(db.transactions).get();
    expect(transactions.length, 1);
    expect(transactions.first.description, 'Test transaction');
    
    await db.close();
  });
}
```

---

## ⚠️ Migration Failure Handling

### What If Migration Fails?

```dart
if (from < 6) {
  try {
    // Destructive operation
    final rows = await customSelect('SELECT * FROM old_table').get();
    
    // Backup
    for (final row in rows) {
      await into(newTable).insert(/* ... */);
    }
    
    // Verify backup succeeded
    final count = await (select(newTable).get()).then((t) => t.length);
    if (count != rows.length) {
      throw Exception('Backup verification failed');
    }
    
    // Drop old table
    await m.deleteTable('old_table');
  } catch (e) {
    // Log error
    print('[Migration v6] Failed: $e');
    
    // Rethrow to prevent migration completion
    rethrow;
  }
}
```

**Rule:** If migration throws, Drift will **NOT** update `schemaVersion`. App will retry migration on next launch.

---

## 📋 Pre-Commit Checklist

Before committing schema changes:

- [ ] `schemaVersion` incremented
- [ ] Migration step added with `if (from < N)` guard
- [ ] Destructive migrations have backup code
- [ ] `build_runner build` completed successfully
- [ ] `.g.dart` files committed (generated code)
- [ ] Migration test written and passing
- [ ] Tested upgrade from old version
- [ ] No existing migration steps modified

---

## 🚫 Common Mistakes to Avoid

### 1. Forgot to Increment schemaVersion
```dart
// ❌ WRONG - Added migration but forgot to increment
int get schemaVersion => 5; // Should be 6!

if (from < 6) {
  await m.addColumn(transactions, transactions.notes);
  // This will NEVER run because schemaVersion is still 5
}
```

### 2. Modified Existing Migration
```dart
// ❌ WRONG - Changed existing migration step
if (from < 3) {
  await m.addColumn(budgets, budgets.userId);
  await m.addColumn(budgets, budgets.isActive); // DON'T add to existing step
}

// ✅ CORRECT - Add new step
if (from < 3) {
  await m.addColumn(budgets, budgets.userId);
}
if (from < 6) {
  await m.addColumn(budgets, budgets.isActive); // New step
}
```

### 3. Destructive Operation Without Backup
```dart
// ❌ WRONG - Drop without backup
if (from < 6) {
  await m.deleteTable('old_transactions');
  // User data LOST!
}

// ✅ CORRECT - Backup first
if (from < 6) {
  final rows = await customSelect('SELECT * FROM old_transactions').get();
  // ... backup to new table ...
  await m.deleteTable('old_transactions');
}
```

### 4. Missing Build Runner
```dart
// Made schema changes but forgot:
// flutter pub run build_runner build --delete-conflicting-outputs
// Result: Compile errors, missing generated code
```

---

## 🎯 Quick Reference

### Migration Template

```dart
if (from < N) {
  // 1. For destructive ops: backup data first
  final rows = await customSelect('SELECT * FROM old_table').get();
  
  // 2. Perform migration operation
  await m.addColumn(table, table.column);
  // or: await m.deleteTable('old_table');
  // or: await m.createTable(newTable);
  
  // 3. For destructive ops: restore data
  for (final row in rows) {
    await into(newTable).insert(/* ... */);
  }
}
```

### Commands

```bash
# Generate code after schema change
flutter pub run build_runner build --delete-conflicting-outputs

# Run migration tests
flutter test test/database/migrations_test.dart

# Check current schema version in database
flutter run
# Then inspect: AppDatabase.schemaVersion
```

---

**Remember:** Every schema change requires: increment version → add guarded migration → backup if destructive → generate code → test. No exceptions.
