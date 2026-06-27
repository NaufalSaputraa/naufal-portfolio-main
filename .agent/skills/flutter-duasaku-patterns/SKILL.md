---
name: flutter-duasaku-patterns
description: DuaSaku-specific Flutter patterns for widget structure, animations, theming, and localization. Use when working on DuaSaku UI components to enforce consistent patterns.
when_to_use: "When building or modifying Flutter UI components in DuaSaku. Enforces widget structure, animation timing, theme usage, and localization. NOT for general Flutter projects."
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Flutter DuaSaku Patterns

> **Philosophy:** Consistent, theme-aware, localized, performant Flutter code for DuaSaku.
> **Core Principle:** Every widget follows DuaSaku standards — no exceptions.

---

## 🔴 MANDATORY RULES

Before writing ANY Flutter widget code in DuaSaku, verify these rules:

### 1. Widget Structure Rules

**Constructor:**
```dart
// ✅ CORRECT - const constructor with super.key
class TransactionCard extends ConsumerWidget {
  const TransactionCard({super.key, required this.transaction});
  
  final Transaction transaction;
}

// ❌ WRONG - missing const or super.key
class TransactionCard extends ConsumerWidget {
  TransactionCard({required this.transaction});
  final Transaction transaction;
}
```

**Widget Type:**
```dart
// ✅ CORRECT - Use ConsumerWidget directly
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(myProvider);
    return Container();
  }
}

// ❌ WRONG - Don't use Consumer wrapper
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer(
      builder: (context, ref, child) {
        return Container();
      },
    );
  }
}
```

**Extraction Rules:**
- Extract widget to separate file if **> 80 lines**
- Extract repeated widget patterns to reusable components
- DON'T nest more than **5 levels** deep — extract to method or widget

**Const Usage:**
```dart
// ✅ CORRECT - Use const wherever possible
const SizedBox(height: 16)
const Padding(padding: EdgeInsets.all(16))
const Icon(Icons.check)

// ❌ WRONG - Missing const on immutable widgets
SizedBox(height: 16)  // Should be const
```

---

### 2. Theme System (MANDATORY)

**Color Usage:**
```dart
// ✅ CORRECT - Always use Theme.of(context)
Container(
  decoration: BoxDecoration(
    color: Theme.of(context).colorScheme.surface,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(
      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.08),
    ),
  ),
)

// ❌ WRONG - Hardcoded colors
Container(
  color: Color(0xFF1A1A2E),  // NEVER hardcode colors
  decoration: BoxDecoration(
    border: Border.all(color: Colors.grey),  // NEVER use Colors.*
  ),
)
```

**Border Radius Standard:**
```dart
// ✅ CORRECT - 16px for cards
BorderRadius.circular(16)

// ❌ WRONG - Other values
BorderRadius.circular(8)   // Too small
BorderRadius.circular(12)  // Inconsistent
```

**Card Design:**
```dart
// ✅ CORRECT - Border, NOT elevation
Container(
  decoration: BoxDecoration(
    color: Theme.of(context).colorScheme.surface,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(
      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.08),
    ),
  ),
  child: content,
)

// ❌ WRONG - Using elevation/shadow
Card(
  elevation: 4,  // DON'T use elevation
  child: content,
)
```

**AppBar Style:**
```dart
// ✅ CORRECT - Transparent, no elevation
AppBar(
  backgroundColor: Colors.transparent,
  elevation: 0,
  title: Text('Title'),
)

// ❌ WRONG - Opaque or elevated
AppBar(
  elevation: 4,  // DON'T use elevation
  backgroundColor: Theme.of(context).colorScheme.primary,
)
```

---

### 3. Localization (MANDATORY)

**ALL user-facing strings MUST use `.tr()`:**

```dart
// ✅ CORRECT - Localized strings
Text('transaction.title'.tr())
Text('wallet.balance'.tr(args: [formattedAmount]))
Text('common.save'.tr())

// ❌ WRONG - Hardcoded strings
Text('Transaksi')  // NEVER hardcode Indonesian
Text('Transaction')  // NEVER hardcode English
Text('Saldo: Rp 100.000')  // NEVER hardcode
```

**Translation File Structure:**
```
assets/translations/
├── id.json  # Indonesian
└── en.json  # English
```

**Before Adding New Strings:**
1. Check if key already exists in translation files
2. Add to BOTH `id.json` AND `en.json`
3. Use descriptive keys: `feature.screen.element` format
4. Examples:
   - `transaction.list.title`
   - `wallet.balance.label`
   - `common.save`
   - `error.network.message`

---

### 4. Animation Guidelines

**Standard Timing:**
```dart
// ✅ CORRECT - 200-400ms with easeOutCubic
Widget.animate()
  .fadeIn(duration: 300.ms, curve: Curves.easeOutCubic)
  .slideY(begin: 0.1, end: 0)

// ❌ WRONG - Too fast or too slow
Widget.animate()
  .fadeIn(duration: 50.ms)   // Too fast
  .fadeIn(duration: 1000.ms)  // Too slow
```

**List Staggering:**
```dart
// ✅ CORRECT - Max 5-8 stagger items
ListView.builder(
  itemCount: min(items.length, 8),  // Cap stagger
  itemBuilder: (context, index) {
    return item
      .animate()
      .fadeIn(delay: Duration(milliseconds: index * 50))
      .slideY(begin: 0.1, end: 0);
  },
)

// ❌ WRONG - Too many animations
ListView.builder(
  itemCount: 100,  // Don't animate all 100 items
  itemBuilder: (context, index) {
    return item.animate().fadeIn(delay: Duration(milliseconds: index * 50));
  },
)
```

**Default Curve:**
```dart
// ✅ CORRECT - Use Curves.easeOutCubic
Curves.easeOutCubic

// ❌ WRONG - Don't use linear or default
Curves.linear
Curves.ease
```

**Loading States:**
```dart
// ✅ CORRECT - Use Shimmer for loading
Shimmer.fromColors(
  baseColor: Theme.of(context).colorScheme.surface,
  highlightColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1),
  child: Container(),
)

// ❌ WRONG - Generic CircularProgressIndicator
Center(child: CircularProgressIndicator())  // Too generic
```

---

### 5. Performance Rules

**ListView:**
```dart
// ✅ CORRECT - Use .builder for long lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)

// ❌ WRONG - ListView without .builder
ListView(
  children: items.map((item) => ItemWidget(item)).toList(),
)
```

**Provider Select:**
```dart
// ✅ CORRECT - Use select to avoid rebuilds
final balance = ref.watch(walletProvider.select((w) => w.balance));

// ❌ WRONG - Watch entire state when only need one field
final wallet = ref.watch(walletProvider);
final balance = wallet.balance;  // Rebuilds on ANY wallet change
```

**Const Widgets:**
```dart
// ✅ CORRECT - const for immutable widgets
const SizedBox(height: 16)
const Divider()
const Icon(Icons.check)

// Use where() instead of if for conditional const
ListView(
  children: [
    const Header(),
    if (showContent) const Content(),  // ✅ Can be const
    const Footer(),
  ].where((w) => w != null).toList(),
)
```

---

## 📋 Pre-Widget Checklist

Before writing any new widget, verify:

- [ ] Using `ConsumerWidget` or `ConsumerStatefulWidget` (NOT Consumer wrapper)
- [ ] Constructor has `const` keyword and `super.key`
- [ ] All colors from `Theme.of(context).colorScheme`
- [ ] Border radius is 16px for cards
- [ ] All user-facing strings use `.tr()`
- [ ] Animation duration is 200-400ms with `Curves.easeOutCubic`
- [ ] Using `ListView.builder` for lists (NOT `ListView`)
- [ ] Using `const` on immutable widgets
- [ ] Widget extraction if > 80 lines
- [ ] Max 5 levels nesting depth

---

## 🔍 Code Review Checklist

When reviewing Flutter code in DuaSaku, check:

### Theme Violations:
- ❌ Hardcoded colors (Color(0xFF...), Colors.grey)
- ❌ Wrong border radius (not 16px)
- ❌ Using Card elevation instead of border
- ❌ AppBar with elevation

### Localization Violations:
- ❌ Hardcoded Indonesian strings
- ❌ Hardcoded English strings
- ❌ Missing `.tr()` on user-facing text

### Performance Issues:
- ❌ `ListView` without `.builder`
- ❌ Watching entire provider when only need one field
- ❌ Missing `const` on immutable widgets
- ❌ Too many animated items (> 8 stagger)

### Structure Issues:
- ❌ Widget > 80 lines not extracted
- ❌ Nesting > 5 levels deep
- ❌ Using Consumer wrapper instead of ConsumerWidget
- ❌ Missing `const` constructor

---

## 🎯 Common Patterns

### Standard Card Pattern:
```dart
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Theme.of(context).colorScheme.surface,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(
      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.08),
    ),
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        'card.title'.tr(),
        style: Theme.of(context).textTheme.titleMedium,
      ),
      const SizedBox(height: 8),
      Text(
        'card.content'.tr(),
        style: Theme.of(context).textTheme.bodyMedium,
      ),
    ],
  ),
)
```

### Standard List Item with Animation:
```dart
ListView.builder(
  itemCount: min(items.length, 8),
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index].title.tr()),
    )
      .animate()
      .fadeIn(
        duration: 300.ms,
        delay: Duration(milliseconds: index * 50),
        curve: Curves.easeOutCubic,
      )
      .slideY(begin: 0.1, end: 0);
  },
)
```

### Standard Provider Consumer:
```dart
class MyWidget extends ConsumerWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(myProvider.select((s) => s.field));
    
    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: Text(
        'widget.label'.tr(),
        style: Theme.of(context).textTheme.bodyMedium,
      ),
    );
  }
}
```

---

## 🚨 Common Mistakes to Avoid

1. **Theme:** Hardcoding colors or using wrong border radius
2. **Localization:** Forgetting `.tr()` on new strings
3. **Performance:** Using `ListView` without `.builder`
4. **Animation:** Animating too many items or wrong duration
5. **Structure:** Not extracting large widgets or deep nesting
6. **Const:** Forgetting `const` on immutable widgets

---

**Remember:** These are DuaSaku-specific patterns. Every Flutter widget in this project MUST follow these rules for consistency and maintainability.
