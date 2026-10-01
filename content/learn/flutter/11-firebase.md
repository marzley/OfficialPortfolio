---
slug: firebase-auth-firestore
title: Firebase: sign-in, Firestore database and real-time data
after: local-storage-offline
---
# Firebase: sign-in, Firestore database and real-time data

**Firebase** is Google's "backend as a service": ready-made login, a cloud database, file storage, push notifications and crash reports, without writing your own server. It's popular for Flutter apps because the official **FlutterFire** packages are excellent, and the free **Spark plan** is enough for learning and small apps.

| Firebase product | What it gives you |
|---|---|
| **Authentication** | Sign in with email/password, phone (SMS code), Google, Apple |
| **Cloud Firestore** | A NoSQL cloud database with real-time updates and offline support |
| **Storage** | Upload and download files (profile photos, receipts) |
| **Cloud Messaging (FCM)** | Push notifications |
| **Crashlytics** | Crash reports from users' phones |
| **Cloud Functions** | Your own server code (for M-Pesa callbacks, for example), needs the paid Blaze plan |

## Setting up (once per project)

1. Go to **console.firebase.google.com** → Add project.
2. Install the tools: `npm install -g firebase-tools`, then `firebase login`.
3. In your Flutter project: `dart pub global activate flutterfire_cli` then `flutterfire configure`. Pick your project and platforms. It creates **`lib/firebase_options.dart`**.
4. Add packages: `flutter pub add firebase_core firebase_auth cloud_firestore`.
5. Start Firebase before the app runs:

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
// import 'firebase_options.dart';   // created by flutterfire configure

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();            // needed before any await in main
  await Firebase.initializeApp(/* options: DefaultFirebaseOptions.currentPlatform */);
  runApp(const MaterialApp(home: Scaffold(body: Center(child: Text('Firebase ready')))));
}
```

> `firebase_options.dart` and `google-services.json` identify your project; they aren't secret keys. What protects your data is **Security Rules** (below), so always write them.

## Authentication: email and password

In the console: **Authentication → Sign-in method → Email/Password → Enable**.

```dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class AuthService {
  final _auth = FirebaseAuth.instance;

  Stream<User?> get changes => _auth.authStateChanges();      // fires on login and logout
  User? get current => _auth.currentUser;

  Future<String?> signUp(String email, String password, String name) async {
    try {
      final cred = await _auth.createUserWithEmailAndPassword(email: email, password: password);
      await cred.user!.updateDisplayName(name);
      await cred.user!.sendEmailVerification();
      return null;                                            // null = success
    } on FirebaseAuthException catch (e) {
      return _message(e.code);
    }
  }

  Future<String?> signIn(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
      return null;
    } on FirebaseAuthException catch (e) {
      return _message(e.code);
    }
  }

  Future<void> resetPassword(String email) => _auth.sendPasswordResetEmail(email: email);
  Future<void> signOut() => _auth.signOut();

  // Turn Firebase's codes into messages people understand
  String _message(String code) => switch (code) {
        'email-already-in-use' => 'An account already uses that email. Try signing in.',
        'invalid-email' => 'That email address doesn\'t look right.',
        'weak-password' => 'Choose a stronger password (at least 8 characters).',
        'user-not-found' || 'wrong-password' || 'invalid-credential' => 'Wrong email or password.',
        'too-many-requests' => 'Too many tries. Wait a few minutes and try again.',
        'network-request-failed' => 'No internet connection.',
        _ => 'Something went wrong ($code).',
      };
}

/// Shows the login screen or the app, and switches automatically when the user signs in or out.
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: AuthService().changes,
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        return snap.hasData ? const Scaffold(body: Center(child: Text('Home'))) : const Scaffold(body: Center(child: Text('Login screen')));
      },
    );
  }
}
```

**Phone number sign-in** (SMS code) is very popular in Kenya: `FirebaseAuth.instance.verifyPhoneNumber(phoneNumber: '+254712345678', ...)`. It has a free monthly SMS quota; check current pricing before relying on it at scale.

## Cloud Firestore: how data is organised

Firestore stores **documents** (like JSON objects) inside **collections**:

```
shops (collection)
└── duka_thika (document)          { name: "Duka Thika", owner: "uid123", county: "Kiambu" }
    └── products (sub-collection)
        ├── p1                     { name: "Unga 2kg", price: 180, stock: 12 }
        └── p2                     { name: "Sugar 1kg", price: 150, stock: 0 }
```

It is **not** SQL: there are no joins. You design data around the screens that read it, and it's normal to copy a little data (for example the shop name) into several documents.

## Reading, writing and live updates

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class Product {
  final String id, name;
  final int price, stock;
  Product({required this.id, required this.name, required this.price, required this.stock});

  factory Product.fromDoc(DocumentSnapshot<Map<String, dynamic>> d) {
    final m = d.data() ?? {};
    return Product(id: d.id, name: m['name'] as String? ?? '', price: (m['price'] as num? ?? 0).toInt(), stock: (m['stock'] as num? ?? 0).toInt());
  }
}

class ProductRepo {
  final CollectionReference<Map<String, dynamic>> col;
  ProductRepo(String shopId) : col = FirebaseFirestore.instance.collection('shops').doc(shopId).collection('products');

  // Create (Firestore makes the id)
  Future<void> add(String name, int price, int stock) =>
      col.add({'name': name, 'price': price, 'stock': stock, 'createdAt': FieldValue.serverTimestamp()});

  // Update some fields
  Future<void> setPrice(String id, int price) => col.doc(id).update({'price': price});

  // Change a number safely even if two phones do it at once
  Future<void> sellOne(String id) => col.doc(id).update({'stock': FieldValue.increment(-1)});

  Future<void> delete(String id) => col.doc(id).delete();

  // Read once
  Future<List<Product>> inStockOnce() async {
    final snap = await col.where('stock', isGreaterThan: 0).orderBy('stock').limit(50).get();
    return snap.docs.map(Product.fromDoc).toList();
  }

  // Live: the stream sends a new list every time any product changes, on any phone
  Stream<List<Product>> watchAll() =>
      col.orderBy('name').snapshots().map((s) => s.docs.map(Product.fromDoc).toList());
}

class LiveStockList extends StatelessWidget {
  final ProductRepo repo;
  const LiveStockList({super.key, required this.repo});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Product>>(
      stream: repo.watchAll(),
      builder: (context, snap) {
        if (snap.hasError) return Center(child: Text('Error: ${snap.error}'));
        if (!snap.hasData) return const Center(child: CircularProgressIndicator());
        final items = snap.data!;
        return ListView(children: [
          for (final p in items)
            ListTile(
              title: Text(p.name),
              subtitle: Text('KSh ${p.price}'),
              trailing: FilledButton.tonal(onPressed: p.stock > 0 ? () => repo.sellOne(p.id) : null, child: Text('Sell (${p.stock})')),
            ),
        ]);
      },
    );
  }
}
```

Open the app on two phones: sell an item on one, and the stock changes on the other within a second. That's the **real-time** power of Firestore. It also works **offline**: changes are saved on the phone and sent when the connection returns.

## Security Rules: the part people forget

When you create the database, Firestore asks for "test mode" (anyone can read and write for 30 days). **Never launch like that.** Anyone with your project id could read or wipe everything. Write rules in **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shops/{shopId} {
      // only the shop's owner can read or change the shop
      allow read, write: if request.auth != null && request.auth.uid == resource.data.owner;
      allow create: if request.auth != null && request.resource.data.owner == request.auth.uid;

      match /products/{productId} {
        allow read, write: if request.auth != null
          && get(/databases/$(database)/documents/shops/$(shopId)).data.owner == request.auth.uid;
      }
    }
  }
}
```

Test rules in the console's **Rules Playground** before publishing.

## Costs (and how to stay on the free plan)

Firestore charges by **reads, writes and deletes**, with a daily free quota. Each document returned counts as a read. To stay cheap:

- Use `.limit()` and paging; don't load a whole collection to show 10 items.
- Listen with `snapshots()` only on screens that need live data, and cancel when leaving (StreamBuilder does this for you).
- Keep counts in a document (`FieldValue.increment`) instead of counting all documents.

## Firebase or your own backend?

| Firebase | Own backend (PHP/Node + MySQL on cPanel) |
|---|---|
| Fast to start, no server to manage | Full control, SQL reports and joins |
| Real-time and offline built in | Predictable monthly hosting cost in KSh |
| Costs grow with reads | Works with M-Pesa callbacks easily |
| Vendor lock-in | You can move hosts any time |

Many Kenyan apps mix them: Firebase Auth and push notifications, plus a PHP/MySQL API for business data and M-Pesa. See **APIs & backends for apps**.

```quiz
Q: What must you call before Firebase.initializeApp when main is async?
A: WidgetsFlutterBinding.ensureInitialized | WidgetsFlutterBinding.ensureInitialized()
Q: Which command creates firebase_options.dart for your app?
A: flutterfire configure
Q: In Firestore, documents are stored inside ...?
A: collections | a collection
Q: Which Firestore method gives live updates as a stream?
A: snapshots | snapshots()
Q: Which FieldValue changes a number safely when two phones update it at once?
A: FieldValue.increment | increment
Q: What protects your Firestore data from strangers?
A: Security Rules | rules | security rules
Q: Which widget rebuilds each time a Stream sends new data?
A: StreamBuilder
```
