---
slug: http-apis-json
title: Loading data from the internet: http, JSON models and FutureBuilder
after: state-management
---
# Loading data from the internet: http, JSON models and FutureBuilder

Most apps show data from a server: products, orders, news, exam results. The app sends an **HTTP request** to an **API**, gets back **JSON**, turns it into Dart objects and shows them. This lesson does the whole journey properly: models, errors, loading states, POST requests and timeouts.

> New to APIs? Read **APIs & backends for apps → How backends work** first.

## Setup

```
flutter pub add http
```

Android needs internet permission for **release** builds (debug builds have it already). In `android/app/src/main/AndroidManifest.xml`, above `<application`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Forgetting this is the #1 reason "it works on my phone but not in the APK I sent the client".

## The JSON we'll load

A public test API, `https://jsonplaceholder.typicode.com/users`, returns a list like:

```json
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz",
    "phone": "1-770-736-8031 x56442",
    "address": { "city": "Gwenborough" },
    "company": { "name": "Romaguera-Crona" }
  }
]
```

## Step 1: a model class with fromJson

Never pass raw `Map<String, dynamic>` around your app. Turn JSON into a **typed class** once, at the edge. Then the editor autocompletes fields and typos become compile errors.

```dart
class User {
  final int id;
  final String name;
  final String email;
  final String city;
  final String company;

  const User({required this.id, required this.name, required this.email, required this.city, required this.company});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      city: (json['address'] as Map<String, dynamic>?)?['city'] as String? ?? 'Unknown',   // nested and possibly missing
      company: (json['company'] as Map<String, dynamic>?)?['name'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'email': email};
}

void main() {
  final u = User.fromJson({'id': 7, 'name': 'Amina', 'email': 'amina@example.com', 'address': {'city': 'Mombasa'}});
  print('${u.name} from ${u.city}');   // Amina from Mombasa
  print(u.toJson());
}
```

`factory` constructors can do work before creating the object. `?? 'Unknown'` gives a default when a field is missing: servers change, so be defensive.

> For big models, packages like **json_serializable** or **freezed** generate `fromJson`/`toJson` for you. Learn to write them by hand first.

## Step 2: a service that talks to the API

Keep network code out of widgets, in its own class:

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class User {
  final int id;
  final String name, email, city;
  const User(this.id, this.name, this.email, this.city);
  factory User.fromJson(Map<String, dynamic> j) =>
      User(j['id'] as int, j['name'] as String, j['email'] as String, (j['address'] as Map<String, dynamic>?)?['city'] as String? ?? '');
}

/// A friendly error the UI can show as it is.
class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  @override
  String toString() => message;
}

class UserApi {
  static const base = 'https://jsonplaceholder.typicode.com';
  final http.Client client;
  UserApi({http.Client? client}) : client = client ?? http.Client();

  Future<List<User>> fetchUsers() async {
    try {
      final res = await client
          .get(Uri.parse('$base/users'), headers: {'Accept': 'application/json'})
          .timeout(const Duration(seconds: 15));             // don't wait forever on a bad network
      if (res.statusCode != 200) {
        throw ApiException('The server replied ${res.statusCode}. Please try again later.');
      }
      final list = jsonDecode(res.body) as List<dynamic>;
      return list.map((e) => User.fromJson(e as Map<String, dynamic>)).toList();
    } on SocketException {
      throw ApiException('No internet connection. Check your data or Wi-Fi.');
    } on TimeoutException {
      throw ApiException('The network is slow. Please try again.');
    } on FormatException {
      throw ApiException('We got an unexpected reply from the server.');
    }
  }

  Future<int> createPost(String title, String body) async {
    final res = await client.post(
      Uri.parse('$base/posts'),
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: jsonEncode({'title': title, 'body': body, 'userId': 1}),
    );
    if (res.statusCode != 201) throw ApiException('Could not save (${res.statusCode}).');
    return (jsonDecode(res.body) as Map<String, dynamic>)['id'] as int;
  }
}

Future<void> main() async {
  final api = UserApi();
  try {
    final users = await api.fetchUsers();
    print('Loaded ${users.length} users, first: ${users.first.name}');
  } on ApiException catch (e) {
    print(e);
  }
}
```

What each part protects you from:

| Code | Protects against |
|---|---|
| `.timeout(...)` | Hanging forever on a weak signal |
| Checking `statusCode` | Showing an error page's HTML as if it were data |
| `on SocketException` | No internet (very common on phones) |
| `on FormatException` | The server returned something that isn't JSON |
| `ApiException` with a friendly message | Scary technical errors on screen |

## Step 3: showing it with FutureBuilder

`FutureBuilder` rebuilds when a `Future` finishes, and gives you a **snapshot** with the state:

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() => runApp(const MaterialApp(home: UsersScreen()));

Future<List<Map<String, dynamic>>> fetchUsers() async {
  final res = await http.get(Uri.parse('https://jsonplaceholder.typicode.com/users')).timeout(const Duration(seconds: 15));
  if (res.statusCode != 200) throw Exception('Server error ${res.statusCode}');
  return (jsonDecode(res.body) as List).cast<Map<String, dynamic>>();
}

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});
  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  late Future<List<Map<String, dynamic>>> future;

  @override
  void initState() {
    super.initState();
    future = fetchUsers();          // start loading ONCE, here, not in build()
  }

  void retry() => setState(() => future = fetchUsers());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Customers')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: future,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError) {
            return Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.wifi_off, size: 48),
                const SizedBox(height: 8),
                Text('${snap.error}'),
                TextButton(onPressed: retry, child: const Text('Try again')),
              ]),
            );
          }
          final users = snap.data!;
          if (users.isEmpty) return const Center(child: Text('No customers yet'));
          return RefreshIndicator(
            onRefresh: () async { retry(); await future; },
            child: ListView.builder(
              itemCount: users.length,
              itemBuilder: (context, i) => ListTile(
                leading: CircleAvatar(child: Text((users[i]['name'] as String)[0])),
                title: Text(users[i]['name'] as String),
                subtitle: Text(users[i]['email'] as String),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

**The most common FutureBuilder bug:** calling `fetchUsers()` directly in `future:` inside `build()`. Every rebuild (even a keyboard opening) starts a new request. Create the future in `initState` and store it.

## Sending data (POST, PUT, DELETE)

| Method | Use | Typical success code |
|---|---|---|
| `http.get` | Read | 200 |
| `http.post` | Create | 201 (or 200) |
| `http.put` / `http.patch` | Update all / some fields | 200 |
| `http.delete` | Delete | 200 or 204 |

Always send `Content-Type: application/json` and `jsonEncode` the body, as in `createPost` above.

## Login tokens

Most real APIs need you to prove who you are. After login, the server gives a **token**; send it with every request:

```dart
final res = await http.get(
  Uri.parse('https://api.example.co.ke/orders'),
  headers: {'Authorization': 'Bearer $token', 'Accept': 'application/json'},
);
if (res.statusCode == 401) {
  // token expired: send the user back to the login screen
}
```

Store tokens with **flutter_secure_storage** (encrypted), not in plain SharedPreferences.

## Security rules for API calls

- **Never put secret keys in the app** (M-Pesa consumer secret, payment keys, database passwords). Anyone can unpack an APK and read them. Your app talks to **your** server; your server holds the secrets and talks to M-Pesa.
- Use **HTTPS** only. Android blocks plain `http://` by default in release builds.
- Validate everything on the server too.

## Testing on the emulator with a local server

If your PHP/Node API runs on your laptop, the Android emulator reaches it at **`http://10.0.2.2:8000`** (not `localhost`, which means the emulator itself). A real phone on the same Wi-Fi uses your laptop's IP, like `http://192.168.1.20:8000`.

```quiz
Q: Which function turns a JSON string into Dart maps and lists?
A: jsonDecode | jsonDecode()
Q: Which function turns a Dart map into a JSON string?
A: jsonEncode | jsonEncode()
Q: What status code usually means a GET request succeeded?
A: 200
Q: Where should you create the Future used by a FutureBuilder?
A: initState | in initState
Q: Which Android permission must release builds have to use the network?
A: INTERNET | android.permission.INTERNET
Q: What address does the Android emulator use to reach a server on your laptop?
A: 10.0.2.2 | http://10.0.2.2
Q: Which HTTP header carries a login token? Write the header name.
A: Authorization
```
