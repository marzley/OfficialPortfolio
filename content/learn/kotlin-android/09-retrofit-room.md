---
slug: retrofit-and-room
title: "Data: Retrofit for APIs and Room for the local database"
after: navigation-and-mvvm
---
# Data: Retrofit for APIs and Room for the local database

Most Android apps load data from a server and keep a local copy for speed and offline use. The standard tools are **Retrofit** (HTTP APIs) and **Room** (a database on the phone, built on SQLite).

## Permissions

Add internet permission to `AndroidManifest.xml` (above `<application>`):

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Retrofit: calling a REST API

Dependencies (check the latest versions): `com.squareup.retrofit2:retrofit`, a JSON converter (for example `com.squareup.retrofit2:converter-gson` or kotlinx.serialization), and optionally `com.squareup.okhttp3:logging-interceptor`.

### 1. Model classes for the JSON

```kotlin
data class ProductDto(
    val id: Int,
    val name: String,
    val price: Int,
    val stock: Int,
)

data class CreateOrderRequest(val productId: Int, val qty: Int, val phone: String)
data class OrderResponse(val orderId: Int, val total: Int, val status: String)
```

### 2. The API interface

```kotlin
import retrofit2.http.*

interface DukaApi {
    @GET("products")
    suspend fun products(@Query("q") search: String? = null): List<ProductDto>

    @GET("products/{id}")
    suspend fun product(@Path("id") id: Int): ProductDto

    @POST("orders")
    suspend fun createOrder(@Body body: CreateOrderRequest): OrderResponse
}
```

`suspend` functions run on a background thread automatically and return the parsed result.

### 3. Build the client (once)

```kotlin
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object Network {
    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .addInterceptor { chain ->                       // add the login token to every request
            val token = TokenStore.token
            val request = chain.request().newBuilder()
                .apply { if (token != null) header("Authorization", "Bearer $token") }
                .build()
            chain.proceed(request)
        }
        .build()

    val api: DukaApi = Retrofit.Builder()
        .baseUrl("https://api.example.co.ke/v1/")       // must end with /
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(DukaApi::class.java)
}

object TokenStore { var token: String? = null }        // in a real app: encrypted storage
```

### 4. Handle errors

```kotlin
import java.io.IOException
import retrofit2.HttpException

suspend fun <T> safeCall(block: suspend () -> T): Result<T> = try {
    Result.success(block())
} catch (e: IOException) {
    Result.failure(Exception("No internet connection"))
} catch (e: HttpException) {
    Result.failure(Exception(if (e.code() == 401) "Please sign in again" else "Server error (${e.code()})"))
}
```

> **Testing with a server on your laptop:** the emulator reaches your computer at `http://10.0.2.2:PORT`. Plain `http://` is blocked by default, so use HTTPS for real servers (and only allow cleartext for local testing via a network security config).

## Room: the local database

Dependencies: `androidx.room:room-runtime`, `androidx.room:room-ktx` and the Room compiler via **KSP**.

### Entity (a table)

```kotlin
import androidx.room.*

@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey val id: Int,
    val name: String,
    val price: Int,
    val stock: Int,
    val updatedAt: Long = System.currentTimeMillis(),
)
```

### DAO (queries)

```kotlin
import kotlinx.coroutines.flow.Flow

@Dao
interface ProductDao {
    @Query("SELECT * FROM products ORDER BY name")
    fun observeAll(): Flow<List<ProductEntity>>           // emits again whenever the table changes

    @Query("SELECT * FROM products WHERE name LIKE '%' || :q || '%' ORDER BY name")
    fun search(q: String): Flow<List<ProductEntity>>

    @Upsert
    suspend fun upsertAll(items: List<ProductEntity>)    // insert or update

    @Query("UPDATE products SET stock = stock - :qty WHERE id = :id")
    suspend fun reduceStock(id: Int, qty: Int)
}
```

### Database

```kotlin
@Database(entities = [ProductEntity::class], version = 1)
abstract class DukaDatabase : RoomDatabase() {
    abstract fun productDao(): ProductDao
}

// create once (e.g. in your Application class or with Hilt):
// val db = Room.databaseBuilder(context, DukaDatabase::class.java, "duka.db").build()
```

When you change tables in a new version, write a **Migration** (`version = 2` plus `addMigrations(...)`) so users keep their data.

## The repository: offline-first

```kotlin
class ProductRepositoryImpl(
    private val api: DukaApi,
    private val dao: ProductDao,
) {
    // The UI always reads the local database: instant, works offline
    fun products(): Flow<List<ProductEntity>> = dao.observeAll()

    // Refresh from the server when possible; the Flow above updates the UI automatically
    suspend fun refresh(): Result<Unit> = safeCall {
        val remote = api.products()
        dao.upsertAll(remote.map { ProductEntity(it.id, it.name, it.price, it.stock) })
    }
}
```

The ViewModel exposes `repository.products()` as state, calls `refresh()` on start and on pull-to-refresh, and shows an error message only if refreshing fails, while still showing the cached list.

## Other storage

| Need | Use |
|---|---|
| Small settings (theme, onboarding done) | **DataStore** (Preferences) |
| Tokens and secrets | Encrypted storage backed by the **Android Keystore** |
| Files (photos, PDFs) | App-specific storage (`context.filesDir`) |
| Background sync even when the app is closed | **WorkManager** |

```quiz
Q: Which library calls REST APIs in Android?
A: Retrofit
Q: Which library is Android's local database layer on top of SQLite?
A: Room
Q: In Room, which annotation marks a table class?
A: @Entity | Entity
Q: In Room, what is the interface with your queries called?
A: DAO | Dao | data access object
Q: Which permission does an app need to use the network?
A: INTERNET | android.permission.INTERNET
Q: Which Jetpack library runs background sync even when the app is closed?
A: WorkManager
```
