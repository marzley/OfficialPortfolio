---
slug: compose-basics
title: "Jetpack Compose basics: layouts, modifiers and Material 3"
after: android-studio-first-app
---
# Jetpack Compose basics: layouts, modifiers and Material 3

In **Jetpack Compose** you describe your UI with Kotlin functions. When data changes, Compose redraws the parts that changed. No XML layouts, no `findViewById`.

## Layout building blocks

| Composable | Arranges children |
|---|---|
| `Column` | Top to bottom |
| `Row` | Left to right |
| `Box` | On top of each other (like a stack) |
| `LazyColumn` / `LazyRow` | Scrollable lists that only build visible items (next lesson) |
| `Spacer` | Empty space |

```kotlin
@Composable
fun OrderCard(orderId: Int, customer: String, total: Int, paid: Boolean) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
    ) {
        Column(Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Order #$orderId", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                AssistChip(onClick = {}, label = { Text(if (paid) "Paid" else "Unpaid") })
            }
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text(customer)
            }
            HorizontalDivider(Modifier.padding(vertical = 8.dp))
            Text("KSh $total", style = MaterialTheme.typography.titleLarge)
        }
    }
}
```

## Modifiers: size, spacing, appearance, behaviour

Modifiers are chained, and **order matters** (padding before background gives a different result from background before padding):

```kotlin
Text(
    "Pay with M-Pesa",
    modifier = Modifier
        .fillMaxWidth()                         // as wide as the parent allows
        .padding(16.dp)                         // space outside the background
        .background(Color(0xFF0B7A5A), RoundedCornerShape(12.dp))
        .padding(vertical = 14.dp)              // space inside the background
        .clickable { /* start payment */ },
    color = Color.White,
    textAlign = TextAlign.Center,
)
```

| Modifier | Does |
|---|---|
| `padding(16.dp)` | Space around |
| `fillMaxWidth()`, `fillMaxSize()`, `size(48.dp)`, `height(56.dp)` | Size |
| `weight(1f)` (inside Row/Column) | Share remaining space (like Flutter's Expanded) |
| `background(color, shape)` | Background |
| `clip(CircleShape)` | Cut to a shape |
| `border(1.dp, Color.Gray, shape)` | Border |
| `clickable { }` | Make it tappable |
| `verticalScroll(rememberScrollState())` | Make a Column scroll |

## Text, images, buttons and inputs

```kotlin
@Composable
fun ProductHeader() {
    Column(Modifier.padding(16.dp)) {
        Image(
            painter = painterResource(R.drawable.unga),          // an image in res/drawable
            contentDescription = "Unga packet",
            modifier = Modifier.fillMaxWidth().height(180.dp).clip(RoundedCornerShape(12.dp)),
            contentScale = ContentScale.Crop,
        )
        Text("Unga 2kg", style = MaterialTheme.typography.headlineSmall)
        Text("KSh 180", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { }) { Text("Add to cart") }          // filled: the main action
            OutlinedButton(onClick = { }) { Text("Details") }      // secondary
            TextButton(onClick = { }) { Text("Share") }            // least important
        }
    }
}
```

For images from the internet, use the **Coil** library: `AsyncImage(model = url, contentDescription = ...)`.

## Material 3 theming

The project template creates `ui/theme/Theme.kt`. Use the theme's colours and text styles instead of hard-coding them, so dark mode and branding work everywhere:

```kotlin
Text("Available balance", style = MaterialTheme.typography.bodySmall)
Text("KSh 12,450", style = MaterialTheme.typography.displaySmall, color = MaterialTheme.colorScheme.primary)
Surface(color = MaterialTheme.colorScheme.primaryContainer) { /* ... */ }
```

On Android 12+, the template can use **dynamic colour** (colours from the user's wallpaper). For a brand, set your own `lightColorScheme(primary = ...)` and `darkColorScheme(...)`.

## Scaffold: the standard screen

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Duka") }) },
        floatingActionButton = {
            ExtendedFloatingActionButton(onClick = { }, icon = { Icon(Icons.Default.Add, null) }, text = { Text("New sale") })
        },
    ) { padding ->
        Column(Modifier.padding(padding).padding(16.dp)) {
            Text("Today's sales", style = MaterialTheme.typography.titleMedium)
            Text("KSh 8,640", style = MaterialTheme.typography.displaySmall)
        }
    }
}
```

## Thinking in Compose

- **UI = function(state)**: given the same data, a composable shows the same thing.
- Composables can run **many times** (recomposition). Keep them fast and free of side effects (no network calls inside).
- Build small, reusable composables (`OrderCard`, `PriceTag`) and combine them.
- Use `@Preview` for each component to design quickly.

```quiz
Q: Which composable arranges children from top to bottom?
A: Column
Q: Which composable arranges children from left to right?
A: Row
Q: Which composable stacks children on top of each other?
A: Box
Q: Inside a Row, which modifier makes a child share the remaining space?
A: weight | weight(1f) | Modifier.weight
Q: Does the order of modifiers matter? (yes or no)
A: yes
Q: Which library loads images from the internet in Compose?
A: Coil
```
