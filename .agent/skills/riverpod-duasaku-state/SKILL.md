---
name: riverpod-duasaku-state
description: Riverpod 2.x state management patterns for DuaSaku. Enforces NotifierProvider usage, bans deprecated providers, and provides migration patterns from StateNotifier. Use when creating or modifying providers.
when_to_use: "When creating or modifying Riverpod providers in DuaSaku. Enforces Riverpod 2.x patterns, correct provider type selection, and ref usage rules. NOT for general Riverpod projects."
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Riverpod DuaSaku State Management

> **Philosophy:** Immutable state. Reactive updates. Type-safe providers.
> **Core Principle:** Use Riverpod 2.x Notifier API — StateNotifier is deprecated.

---

## 🔴 CRITICAL: Banned Providers

**NEVER use these providers in DuaSaku:**

### ❌ StateNotifierProvider (Deprecated in Riverpod 2.x)
```dart
// ❌ BANNED - StateNotifierProvider is deprecated
final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>((ref) {
  return WalletNotifier(ref.watch(walletRepositoryProvider));
});

class WalletNotifier extends StateNotifier<WalletState> {
  WalletNotifier(this._repo) : super(WalletState.initial());
  final WalletRepository _repo;
}
```

**Why banned:** Deprecated in Riverpod 2.x. Use `NotifierProvider` instead.

### ❌ ChangeNotifierProvider (Incompatible)
```dart
// ❌ BANNED - ChangeNotifier is incompatible with Riverpod
final walletProvider = ChangeNotifierProvider<WalletNotifier>((ref) {
  return WalletNotifier();
});

class WalletNotifier extends ChangeNotifier {
  void update() {
    notifyListeners(); // Mutable state pattern
  }
}
```

**Why banned:** Mutable state pattern breaks Riverpod's immutability. Causes unpredictable rebuilds.

---

## ✅ Allowed Provider Types

### Provider Selection Matrix

| Use Case | Provider Type | Example |
|----------|---------------|---------|
| Complex sync state + mutations | `NotifierProvider` | Wallet state with add/update/delete |
| Complex async state + mutations | `AsyncNotifierProvider` | Transaction list with load + mutate |
| Read-only async data | `FutureProvider.autoDispose` | Fetch categories once |
| Realtime streams | `StreamProvider.autoDispose` | Watch balance changes |
| Simple primitives | `StateProvider` | Selected tab index, toggle states |
| Computed values | `Provider` | Formatted currency, derived data |

---

## 📊 NotifierProvider (Sync State + Mutations)

### When to Use
- State is **synchronous** (no async initialization)
- State needs **mutations** (add, update, delete)
- State is **complex** (not just a primitive)

### Pattern

```dart
// ✅ CORRECT - Riverpod 2.x NotifierProvider
class WalletNotifier extends Notifier<WalletState> {
  @override
  WalletState build() {
    // ref is available directly — no constructor injection
    return WalletState.initial();
  }
  
  Future<void> loadWallets() async {
    state = state.copyWith(isLoading: true);
    
    final repo = ref.read(walletRepositoryProvider);
    final wallets = await repo.getWallets();
    
    state = state.copyWith(
      wallets: wallets,
      isLoading: false,
    );
  }
  
  void addWallet(Wallet wallet) {
    state = state.copyWith(
      wallets: [...state.wallets, wallet],
    );
  }
}

// Provider declaration
final walletNotifierProvider = NotifierProvider<WalletNotifier, WalletState>(() {
  return WalletNotifier();
});
```

### Key Points
- `build()` method returns initial state (replaces constructor)
- `ref` is available as property (no constructor injection)
- Provider factory just returns instance: `() => WalletNotifier()`
- State updates via `state = newState`

---

## 📊 AsyncNotifierProvider (Async State + Mutations)

### When to Use
- State requires **async initialization** (API call, DB query)
- State needs **mutations** after loading
- State is **complex** (not just a primitive)

### Pattern

```dart
// ✅ CORRECT - Riverpod 2.x AsyncNotifierProvider
class TransactionListNotifier extends AsyncNotifier<List<Transaction>> {
  @override
  Future<List<Transaction>> build() async {
    // Async initialization
    final repo = ref.watch(transactionRepositoryProvider);
    return repo.fetchAll();
  }
  
  Future<void> addTransaction(Transaction tx) async {
    // Set loading state
    state = const AsyncLoading();
    
    // Perform mutation with error handling
    state = await AsyncValue.guard(() async {
      final repo = ref.read(transactionRepositoryProvider);
      await repo.insert(tx);
      
      // Return updated state
      final current = await future;
      return [...current, tx];
    });
  }
  
  Future<void> deleteTransaction(int id) async {
    state = const AsyncLoading();
    
    state = await AsyncValue.guard(() async {
      final repo = ref.read(transactionRepositoryProvider);
      await repo.delete(id);
      
      // Refresh from source
      return repo.fetchAll();
    });
  }
}

// Provider declaration
final transactionListProvider =
    AsyncNotifierProvider<TransactionListNotifier, List<Transaction>>(() {
  return TransactionListNotifier();
});
```

### Key Points
- `build()` returns `Future<T>` (async initialization)
- `AsyncValue.guard()` handles errors automatically
- Access current data via `await future`
- State has loading/error/data states built-in

---

## 📊 FutureProvider (Read-Only Async)

### When to Use
- Async data that **doesn't need mutations**
- One-time fetch
- No state management needed

### Pattern

```dart
// ✅ CORRECT - FutureProvider for read-only async data
final categoriesProvider = FutureProvider.autoDispose<List<Category>>((ref) async {
  final repo = ref.watch(categoryRepositoryProvider);
  return repo.getAll();
});
```

### Usage in Widget
```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncCategories = ref.watch(categoriesProvider);
    
    return asyncCategories.when(
      data: (categories) => ListView(children: categories.map((c) => Text(c.name)).toList()),
      loading: () => CircularProgressIndicator(),
      error: (err, stack) => Text('Error: $err'),
    );
  }
}
```

---

## 📊 StreamProvider (Realtime Updates)

### When to Use
- Data changes over time (Drift `.watch()` queries)
- Need reactive updates
- Read-only stream

### Pattern

```dart
// ✅ CORRECT - StreamProvider for reactive Drift queries
final balanceStreamProvider = StreamProvider.autoDispose<double>((ref) {
  final db = ref.watch(databaseProvider);
  return db.walletDao.watchTotalBalance();
});
```

### Usage in Widget
```dart
class BalanceWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncBalance = ref.watch(balanceStreamProvider);
    
    return asyncBalance.when(
      data: (balance) => Text('Rp ${balance.toStringAsFixed(0)}'),
      loading: () => Shimmer(...),
      error: (err, stack) => Text('Error'),
    );
  }
}
```

---

## 📊 StateProvider (Simple Primitives)

### When to Use
- **ONLY** for simple primitives (int, bool, String)
- State without complex logic
- Quick toggles, counters, selected index

### Pattern

```dart
// ✅ CORRECT - StateProvider for simple state
final selectedTabProvider = StateProvider<int>((ref) => 0);
final isDarkModeProvider = StateProvider<bool>((ref) => false);
```

### Usage
```dart
// Read
final selectedTab = ref.watch(selectedTabProvider);

// Update
ref.read(selectedTabProvider.notifier).state = 1;
```

**WARNING:** Don't use StateProvider for complex state. Use NotifierProvider instead.

---

## 🔄 Migration: StateNotifier → Notifier

### Before (Deprecated)

```dart
// ❌ OLD - StateNotifier (Riverpod 1.x)
class CounterNotifier extends StateNotifier<int> {
  CounterNotifier(this.ref) : super(0);
  
  final Ref ref;
  
  void increment() {
    state++;
  }
}

final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier(ref);
});
```

### After (Riverpod 2.x)

```dart
// ✅ NEW - Notifier (Riverpod 2.x)
class CounterNotifier extends Notifier<int> {
  @override
  int build() {
    // ref available directly — no constructor injection
    return 0;
  }
  
  void increment() {
    state++;
  }
}

final counterProvider = NotifierProvider<CounterNotifier, int>(() {
  return CounterNotifier();
});
```

### Key Differences
1. `Notifier` has `ref` as property (no constructor)
2. `build()` method returns initial state (replaces `super(initialState)`)
3. Provider factory simpler: `() => CounterNotifier()`
4. For async state, use `AsyncNotifier` + `AsyncNotifierProvider`

---

## 🎯 Ref Usage Rules

### ref.watch vs ref.read

```dart
class MyNotifier extends Notifier<MyState> {
  @override
  MyState build() {
    // ✅ CORRECT - Use ref.watch in build()
    final repo = ref.watch(myRepositoryProvider);
    return MyState.initial();
  }
  
  void doSomething() {
    // ✅ CORRECT - Use ref.read in callbacks/methods
    final repo = ref.read(myRepositoryProvider);
    // ... perform action
  }
}
```

### In Widgets

```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ✅ CORRECT - ref.watch in build()
    final data = ref.watch(myProvider);
    
    return ElevatedButton(
      onPressed: () {
        // ✅ CORRECT - ref.read in callbacks
        ref.read(myProvider.notifier).doSomething();
      },
      child: Text('Action'),
    );
  }
}
```

### ❌ Common Mistakes

```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ElevatedButton(
      onPressed: () {
        // ❌ WRONG - Don't ref.watch in callbacks
        final data = ref.watch(myProvider);
        // This causes rebuild loops!
      },
      child: Text('Action'),
    );
  }
}
```

**Rule:**
- `ref.watch` → in `build()` method ONLY (reactive)
- `ref.read` → in callbacks, async functions, event handlers (one-time read)

---

## 🎯 Using .select for Performance

### Problem: Unnecessary Rebuilds

```dart
// ❌ WRONG - Widget rebuilds on ANY wallet state change
final wallet = ref.watch(walletProvider);
final balance = wallet.balance;
```

### Solution: Use .select

```dart
// ✅ CORRECT - Widget rebuilds ONLY when balance changes
final balance = ref.watch(walletProvider.select((w) => w.balance));
```

### When to Use .select
- Provider state is complex object (class with multiple fields)
- Widget only needs ONE field from state
- Want to avoid rebuilds when other fields change

---

## 🎯 Family Providers (Parameterized Queries)

### When to Use
- Provider needs parameter (e.g., ID, filter)
- Same provider logic, different inputs

### Pattern

```dart
// ✅ CORRECT - Family provider
final walletByIdProvider = FutureProvider.autoDispose.family<Wallet?, int>((ref, id) async {
  final repo = ref.watch(walletRepositoryProvider);
  return repo.getById(id);
});
```

### Usage

```dart
// Pass parameter when watching
final wallet = ref.watch(walletByIdProvider(123));
```

---

## 📋 Provider Checklist

Before creating a provider, ask:

1. **Is state complex?**
   - Yes → Use `NotifierProvider` or `AsyncNotifierProvider`
   - No (primitive) → Use `StateProvider`

2. **Does state need async initialization?**
   - Yes + mutations → Use `AsyncNotifierProvider`
   - Yes, read-only → Use `FutureProvider`
   - No → Use `NotifierProvider`

3. **Is it a stream?**
   - Yes → Use `StreamProvider`

4. **Does state change over time reactively?**
   - Yes (Drift watch) → Use `StreamProvider`
   - Yes (manual mutations) → Use `NotifierProvider` or `AsyncNotifierProvider`

5. **Does widget need entire state or just one field?**
   - Just one field → Use `.select()`
   - Entire state → Watch directly

---

## 🚫 Common Mistakes

### 1. Using StateNotifierProvider
```dart
// ❌ WRONG - StateNotifierProvider is deprecated
final provider = StateNotifierProvider<MyNotifier, MyState>(...);

// ✅ CORRECT - Use NotifierProvider
final provider = NotifierProvider<MyNotifier, MyState>(...);
```

### 2. Using ChangeNotifierProvider
```dart
// ❌ WRONG - ChangeNotifier is banned
final provider = ChangeNotifierProvider<MyNotifier>(...);

// ✅ CORRECT - Use NotifierProvider with immutable state
final provider = NotifierProvider<MyNotifier, MyState>(...);
```

### 3. ref.watch in Callbacks
```dart
// ❌ WRONG - ref.watch in onPressed
onPressed: () {
  final data = ref.watch(myProvider); // Causes rebuild loop!
}

// ✅ CORRECT - ref.read in onPressed
onPressed: () {
  final data = ref.read(myProvider);
}
```

### 4. Not Using .select
```dart
// ❌ WRONG - Rebuilds on any state change
final user = ref.watch(userProvider);
Text(user.name);

// ✅ CORRECT - Rebuilds only when name changes
final name = ref.watch(userProvider.select((u) => u.name));
Text(name);
```

### 5. StateProvider for Complex State
```dart
// ❌ WRONG - StateProvider for complex state
final walletProvider = StateProvider<WalletState>((ref) => WalletState());

// ✅ CORRECT - NotifierProvider for complex state
final walletProvider = NotifierProvider<WalletNotifier, WalletState>(() => WalletNotifier());
```

---

## 🎯 Quick Reference

### Provider Types Summary

```dart
// Simple primitive
StateProvider<int>

// Sync complex state + mutations
NotifierProvider<MyNotifier, MyState>

// Async complex state + mutations
AsyncNotifierProvider<MyNotifier, MyState>

// Read-only async data
FutureProvider.autoDispose<Data>

// Reactive stream
StreamProvider.autoDispose<Data>

// Computed/derived value
Provider<String>

// Parameterized
FutureProvider.family<Data, int>
```

### Ref Usage Summary

```dart
// In build() → ref.watch
@override
Widget build(BuildContext context, WidgetRef ref) {
  final data = ref.watch(myProvider);
}

// In callbacks → ref.read
onPressed: () {
  ref.read(myProvider.notifier).action();
}

// For one field → .select
final name = ref.watch(userProvider.select((u) => u.name));
```

---

**Remember:** DuaSaku uses Riverpod 2.x exclusively. StateNotifierProvider and ChangeNotifierProvider are banned. Always use NotifierProvider or AsyncNotifierProvider for complex state.
