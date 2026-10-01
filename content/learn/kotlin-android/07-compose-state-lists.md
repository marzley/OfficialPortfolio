---
slug: compose-state-lists
title: Compose state, lists and forms
after: compose-basics
---
# Compose state, lists and forms

Apps react to people: tapping, typing, scrolling. In Compose, **state** is data that can change, and when it changes, the composables that read it **recompose** (redraw).

## remember and mutableStateOf

```kotlin
@Composable
fun QuantityPicker(item: String) {
    var qty by remember { mutableStateOf(1) }       // state that survives recomposition

    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(item, Modifier.weight(1f))
        IconButton(onClick = { if (qty > 1) qty-- }, enabled = qty > 1) {
            Icon(Icons.Default.Remove, contentDescription = "Less")
        }
        Text("$qty", style = MaterialTheme.typography.titleLarge)
        IconButton(onClick = { qty++ }) {
            Icon(Icons.Default.Add, contentDescription = "More")
        }
    }
}
```

- `mutableStateOf(1)` creates observable state; changing it triggers recomposition.
- `remember { }` keeps the value across recompositions (without it, `qty` would reset every redraw).
- `rememberSaveable { }` also survives screen rotation and the app being sent to the background.

## State hoisting: the key pattern

Make composables **stateless** by passing the value in and sending events out. The parent owns the state:

```kotlin
@Composable
fun QuantityRow(qty: Int, onChange: (Int) -> Unit) {           // stateless: easy to reuse and test
    Row(verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = { onChange(qty - 1) }, enabled = qty > 0) { Icon(Icons.Default.Remove, "Less") }
        Text("$qty")
        IconButton(onClick = { onChange(qty + 1) }) { Icon(Icons.Default.Add, "More") }
    }
}

@Composable
fun CartLine(name: String, price: Int) {
    var qty by rememberSaveable { mutableStateOf(0) }           // state lives here
    Column {
        Text(name)
        QuantityRow(qty = qty, onChange = { qty = it })
        Text("Subtotal: KSh ${qty * price}")
    }
}
```

**State flows down, events flow up.** This is called **unidirectional data flow**, and it's how all good Compose apps are structured.

## Lists with LazyColumn

```kotlin
data class Txn(val id: Int, val who: String, val amount: Int)

@Composable
fun Statement(txns: List<Txn>, onOpen: (Txn) -> Unit) {
    LazyColumn(
        contentPadding = PaddingValues(vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        item { Text("M-Pesa statement", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(16.dp)) }
        items(txns, key = { it.id }) { t ->                     // keys keep each row's state with the right item
            val received = t.amount > 0
            ListItem(
                headlineContent = { Text(t.who) },
                trailingContent = {
                    Text(
                        (if (received) "+" else "-") + "KSh ${kotlin.math.abs(t.amount)}",
                        color = if (received) Color(0xFF1B7F3B) else Color(0xFFB3261E),
                        fontWeight = FontWeight.Bold,
                    )
                },
                modifier = Modifier.clickable { onOpen(t) },
            )
        }
    }
}
```

`LazyColumn` only composes the rows on screen, so lists with thousands of items stay smooth. Use `LazyVerticalGrid(columns = GridCells.Adaptive(160.dp))` for product grids.

## A form with validation

```kotlin
@Composable
fun SignUpForm(onSubmit: (name: String, phone: String) -> Unit) {
    var name by rememberSaveable { mutableStateOf("") }
    var phone by rememberSaveable { mutableStateOf("") }
    var tried by remember { mutableStateOf(false) }

    val phoneOk = Regex("^(0[17]\\d{8}|254[17]\\d{8})$").matches(phone.filter { it.isDigit() })
    val nameOk = name.trim().contains(" ")

    Column(Modifier.padding(16.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Full name") },
            isError = tried && !nameOk,
            supportingText = { if (tried && !nameOk) Text("Enter your first and last name") },
            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words, imeAction = ImeAction.Next),
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("M-Pesa number") },
            placeholder = { Text("0712 345 678") },
            isError = tried && !phoneOk,
            supportingText = { if (tried && !phoneOk) Text("Enter a number like 0712 345 678") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone, imeAction = ImeAction.Done),
            modifier = Modifier.fillMaxWidth(),
        )
        Button(
            onClick = { tried = true; if (nameOk && phoneOk) onSubmit(name.trim(), phone) },
            modifier = Modifier.fillMaxWidth().height(52.dp),
        ) { Text("Create account") }
    }
}
```

## Side effects: doing things at the right time

Composables can recompose often, so actions like loading data or showing a snackbar go in **effect handlers**:

| Effect | Use |
|---|---|
| `LaunchedEffect(key) { }` | Run a coroutine when the composable appears or `key` changes (load data, start a timer) |
| `rememberCoroutineScope()` | Launch coroutines from click handlers |
| `DisposableEffect(key) { onDispose { } }` | Set up and clean up (listeners, sensors) |

```kotlin
@Composable
fun SaveButton(snackbar: SnackbarHostState) {
    val scope = rememberCoroutineScope()
    Button(onClick = { scope.launch { snackbar.showSnackbar("Saved") } }) { Text("Save") }
}
```

Usually your data loading belongs in a **ViewModel** (lesson 9), not in composables.

```quiz
Q: Which function creates observable state in Compose?
A: mutableStateOf
Q: Which function keeps state across recompositions?
A: remember
Q: Which variant also survives screen rotation?
A: rememberSaveable
Q: Moving state up to the parent and passing value plus events down is called state ...?
A: hoisting
Q: Which composable shows a long, efficient scrolling list?
A: LazyColumn
Q: Which effect runs a coroutine when a composable first appears?
A: LaunchedEffect
```
