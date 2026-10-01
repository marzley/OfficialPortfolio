---
slug: navigation-and-mvvm
title: Navigation, ViewModel and MVVM architecture
after: compose-state-lists
---
# Navigation, ViewModel and MVVM architecture

Real apps have many screens and logic that must survive rotation and keep code organised. Google's recommended architecture uses **Navigation Compose**, **ViewModels** with **StateFlow**, and **repositories**: commonly called **MVVM** (Model, View, ViewModel).

## The architecture in one picture

```
UI layer        Composable screens  ← observe state, send events
                     │ events ▲ state (StateFlow)
                ViewModel          ← holds screen state, calls the repository
                     │
Data layer      Repository          ← single source of truth: decides network vs local database
                ├── Remote data source (Retrofit API)
                └── Local data source (Room database)
```

- **Screens** don't know where data comes from.
- **ViewModels** survive rotation and hold UI state.
- **Repositories** hide the details of APIs and databases, so you can test and change them.

## Navigation Compose

Add the dependency `androidx.navigation:navigation-compose`. Define destinations and a `NavHost`:

```kotlin
@Composable
fun DukaNavHost() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "products") {
        composable("products") {
            ProductsScreen(onOpen = { id -> navController.navigate("product/$id") })
        }
        composable(
            route = "product/{id}",
            arguments = listOf(navArgument("id") { type = NavType.IntType }),
        ) { entry ->
            val id = entry.arguments?.getInt("id") ?: return@composable
            ProductDetailScreen(productId = id, onBack = { navController.popBackStack() })
        }
        composable("cart") { CartScreen() }
    }
}
```

| Call | Does |
|---|---|
| `navController.navigate("cart")` | Open a screen |
| `navController.popBackStack()` | Go back |
| `navigate("home") { popUpTo("login") { inclusive = true } }` | After login: remove the login screen from the back stack |

(Newer Navigation versions also support **type-safe routes** using `@Serializable` classes instead of strings; the ideas are the same.)

A **bottom navigation bar** combines `NavigationBar` + `NavigationBarItem` with `navController.navigate(route)` and highlights the current route from `navController.currentBackStackEntryAsState()`.

## ViewModel + StateFlow

```kotlin
data class ProductsUiState(
    val loading: Boolean = true,
    val products: List<Product> = emptyList(),
    val error: String? = null,
    val query: String = "",
)

data class Product(val id: Int, val name: String, val price: Int, val stock: Int)

class ProductsViewModel(private val repo: ProductRepository) : ViewModel() {

    private val _state = MutableStateFlow(ProductsUiState())
    val state: StateFlow<ProductsUiState> = _state.asStateFlow()   // screens can read, not change

    init { load() }

    fun load() {
        viewModelScope.launch {
            _state.update { it.copy(loading = true, error = null) }
            try {
                val items = repo.getProducts()
                _state.update { it.copy(loading = false, products = items) }
            } catch (e: Exception) {
                _state.update { it.copy(loading = false, error = "Could not load products. Check your internet.") }
            }
        }
    }

    fun onQueryChange(q: String) = _state.update { it.copy(query = q) }
}

interface ProductRepository { suspend fun getProducts(): List<Product> }
```

## The screen observes the state

```kotlin
@Composable
fun ProductsScreen(viewModel: ProductsViewModel = viewModel(), onOpen: (Int) -> Unit) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val visible = state.products.filter { it.name.contains(state.query, ignoreCase = true) }

    Column {
        OutlinedTextField(
            value = state.query,
            onValueChange = viewModel::onQueryChange,
            label = { Text("Search") },
            modifier = Modifier.fillMaxWidth().padding(16.dp),
        )
        when {
            state.loading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
            state.error != null -> Column(Modifier.padding(16.dp)) {
                Text(state.error!!)
                TextButton(onClick = viewModel::load) { Text("Try again") }
            }
            visible.isEmpty() -> Text("No products found", Modifier.padding(16.dp))
            else -> LazyColumn {
                items(visible, key = { it.id }) { p ->
                    ListItem(
                        headlineContent = { Text(p.name) },
                        supportingContent = { Text("KSh ${p.price}") },
                        trailingContent = { Text(if (p.stock == 0) "Out" else "${p.stock} left") },
                        modifier = Modifier.clickable { onOpen(p.id) },
                    )
                }
            }
        }
    }
}
```

`collectAsStateWithLifecycle()` (from `lifecycle-runtime-compose`) collects the flow only while the screen is visible.

## Creating ViewModels with dependencies

ViewModels often need a repository. Options:

- A `ViewModelProvider.Factory` (simple projects).
- **Hilt** (Google's dependency injection library): annotate with `@HiltViewModel` and `@Inject constructor(...)`, then get it with `hiltViewModel()`. Most professional apps use Hilt or Koin.

## Why this structure pays off

| Without architecture | With MVVM |
|---|---|
| Rotating the phone reloads data and loses input | ViewModel keeps the state |
| Network code inside screens | Screens only draw state |
| Hard to test | ViewModels and repositories are plain Kotlin: easy to unit-test |
| Changing from API to database means rewriting screens | Only the repository changes |

```quiz
Q: What does MVVM stand for? Write the three words after Model.
A: View ViewModel | View, ViewModel
Q: Which component survives screen rotation and holds UI state?
A: ViewModel
Q: Which class hides whether data comes from the network or the database?
A: repository | Repository
Q: Which call opens another screen with Navigation Compose?
A: navigate | navController.navigate
Q: Which flow type holds the current screen state?
A: StateFlow
Q: Which Google library is used for dependency injection?
A: Hilt
```
