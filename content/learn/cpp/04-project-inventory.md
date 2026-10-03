---
slug: project-inventory
title: Project: a shop inventory manager in C++
after: inheritance-polymorphism
---
# Project: a shop inventory manager in C++

Let's build a small inventory system for a shop, using classes, `vector`, `map`, algorithms and exceptions: the same structure real point-of-sale software uses, just smaller.

## Requirements

- Products have a code, name, price and stock.
- Add products, receive stock, and sell (with checks).
- Keep a sales record and a running revenue total.
- Report low-stock items and the best sellers.

## The program

```try-cpp
#include <iostream>
#include <iomanip>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

struct Product {
    string code, name;
    double price;
    int stock;
};

class Inventory {
    map<string, Product> products;          // code -> product
    map<string, int> unitsSold;             // code -> units
    double revenue = 0;

    Product &get(const string &code) {
        auto it = products.find(code);
        if (it == products.end()) throw invalid_argument("No product with code " + code);
        return it->second;
    }

public:
    void add(const string &code, const string &name, double price, int stock) {
        if (price <= 0) throw invalid_argument("Price must be positive");
        products[code] = {code, name, price, stock};
    }

    void receive(const string &code, int qty) {
        if (qty <= 0) throw invalid_argument("Quantity must be positive");
        get(code).stock += qty;
    }

    double sell(const string &code, int qty) {
        Product &p = get(code);
        if (qty > p.stock) throw runtime_error("Only " + to_string(p.stock) + " " + p.name + " left");
        p.stock -= qty;
        unitsSold[code] += qty;
        double amount = qty * p.price;
        revenue += amount;
        return amount;
    }

    void report(int lowStockLevel = 5) const {
        cout << left << setw(6) << "Code" << setw(16) << "Product" << right << setw(9) << "Price" << setw(7) << "Stock" << endl;
        for (const auto &[code, p] : products) {
            cout << left << setw(6) << code << setw(16) << p.name << right << fixed << setprecision(2)
                 << setw(9) << p.price << setw(7) << p.stock << (p.stock <= lowStockLevel ? "  <- reorder" : "") << endl;
        }
        cout << "Revenue: KSh " << revenue << endl;

        vector<pair<int, string>> best;
        for (const auto &[code, units] : unitsSold) best.push_back({units, products.at(code).name});
        sort(best.rbegin(), best.rend());
        cout << "Best sellers:";
        for (const auto &[units, name] : best) cout << " " << name << " (" << units << ")";
        cout << endl;
    }
};

int main() {
    Inventory shop;
    shop.add("U2", "Unga 2kg", 180, 20);
    shop.add("S1", "Sugar 1kg", 160, 8);
    shop.add("O1", "Cooking oil 1L", 350, 4);

    try {
        cout << "Sold for KSh " << shop.sell("U2", 6) << endl;
        cout << "Sold for KSh " << shop.sell("S1", 5) << endl;
        shop.receive("O1", 10);
        cout << "Sold for KSh " << shop.sell("O1", 3) << endl;
        shop.sell("S1", 10);                     // not enough stock: throws
    } catch (const exception &e) {
        cout << "Problem: " << e.what() << endl;
    }

    try {
        shop.sell("XX", 1);                      // unknown code: throws
    } catch (const invalid_argument &e) {
        cout << "Problem: " << e.what() << endl;
    }

    cout << endl;
    shop.report();
    return 0;
}
```

## What each part teaches

| Concept | Where |
|---|---|
| `struct` for plain data | `Product` |
| A class guarding its data (private members) | `Inventory` |
| `map` for look-ups by code | `products`, `unitsSold` |
| References to avoid copies and to modify in place | `Product &get(...)` |
| Exceptions for invalid operations | `throw invalid_argument`, `runtime_error` |
| `const` member function (doesn't change the object) | `report() const` |
| Structured bindings and range-for | `for (const auto &[code, p] : products)` |
| `iomanip` for tables | `setw`, `left`, `right`, `setprecision` |
| Sorting pairs | best sellers |

## Challenges

1. Add a `Category` to products and report revenue per category.
2. Apply 16% VAT and print a receipt for each sale.
3. Save the inventory to a file with `ofstream` and load it with `ifstream` at start.
4. Add a menu loop with `cin` so a cashier can use it.
5. Replace `map` with `unordered_map` and compare: what changes in the report order?

## From exercise to real software

Inventory systems are used by shops, pharmacies, hardware stores, warehouses and hospitals to know what's in stock, what to reorder and how much stock is worth. This project combines classes, containers, exceptions and formatted output, the same building blocks used in professional C++ applications. Extending it is an excellent portfolio piece.

## Design before code

| Class / part | Responsibility |
|---|---|
| `Product` | Holds code, name, price, quantity, reorder level; validates values |
| `Inventory` | Stores products by code; adds, sells, restocks, reports |
| Exceptions | Signal invalid operations (unknown code, not enough stock) |
| `main` | User interaction or test scenario |

Keeping responsibilities separate means you could later replace the console interface with a GUI or web API without changing `Inventory`.

## Adding sales history and low-stock alerts

```try-cpp
#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <stdexcept>
using namespace std;

struct Sale {
    string code;
    int qty;
    double amount;
};

class Inventory {
public:
    void add(string code, string name, double price, int qty, int reorder) {
        if (price <= 0 || qty < 0) throw invalid_argument("Invalid price or quantity");
        Item it;
        it.name = name;
        it.price = price;
        it.qty = qty;
        it.reorder = reorder;
        items[code] = it;
    }
    void sell(string code, int qty) {
        if (items.count(code) == 0) throw out_of_range("Unknown code " + code);
        Item &it = items[code];
        if (qty <= 0) throw invalid_argument("Quantity must be positive");
        if (qty > it.qty) throw runtime_error("Only " + to_string(it.qty) + " " + it.name + " left");
        it.qty -= qty;
        Sale s;
        s.code = code;
        s.qty = qty;
        s.amount = qty * it.price;
        sales.push_back(s);
    }
    void lowStock() {
        cout << "Reorder list:" << endl;
        for (auto &pair : items) {
            if (pair.second.qty <= pair.second.reorder) {
                cout << "  " << pair.first << " " << pair.second.name << " (" << pair.second.qty << " left)" << endl;
            }
        }
    }
    double revenue() {
        double total = 0;
        for (auto &s : sales) total += s.amount;
        return total;
    }
private:
    struct Item {
        string name;
        double price;
        int qty;
        int reorder;
    };
    map<string, Item> items;
    vector<Sale> sales;
};

int main() {
    Inventory inv;
    inv.add("U2", "Unga 2kg", 180, 40, 10);
    inv.add("S1", "Sugar 1kg", 210, 12, 10);
    inv.add("O1", "Oil 1L", 350, 8, 5);
    inv.sell("U2", 32);
    inv.sell("O1", 4);
    try {
        inv.sell("S1", 20);
    } catch (exception &e) {
        cout << "Error: " << e.what() << endl;
    }
    try {
        inv.sell("X9", 1);
    } catch (exception &e) {
        cout << "Error: " << e.what() << endl;
    }
    inv.lowStock();
    cout << "Revenue: KSh " << inv.revenue() << endl;
    return 0;
}
```

## Saving and loading data with files

A real inventory must survive restarts. A simple CSV file works:

```cpp
#include <fstream>
#include <sstream>

void Inventory::save(const std::string &path) const {
    std::ofstream out(path);
    for (const auto &[code, it] : items)
        out << code << ',' << it.name << ',' << it.price << ',' << it.qty << ',' << it.reorder << '\n';
}

void Inventory::load(const std::string &path) {
    std::ifstream in(path);
    std::string line;
    while (std::getline(in, line)) {
        std::stringstream ss(line);
        std::string code, name, price, qty, reorder;
        std::getline(ss, code, ','); std::getline(ss, name, ',');
        std::getline(ss, price, ','); std::getline(ss, qty, ','); std::getline(ss, reorder, ',');
        add(code, name, std::stod(price), std::stoi(qty), std::stoi(reorder));
    }
}
```

`const auto &[code, it]` is a C++17 structured binding that unpacks each map entry. For larger systems, a database (SQLite has a C/C++ library) is better than CSV.

## Testing the inventory

Write small checks for each rule:

```cpp
#include <cassert>

void testSellReducesStock() {
    Inventory inv;
    inv.add("A", "Test", 100, 10, 2);
    inv.sell("A", 3);
    assert(inv.quantity("A") == 7);
}

void testOversellThrows() {
    Inventory inv;
    inv.add("A", "Test", 100, 1, 0);
    bool threw = false;
    try { inv.sell("A", 5); } catch (const std::runtime_error &) { threw = true; }
    assert(threw);
}
```

Professional projects use frameworks such as GoogleTest or Catch2 and run tests automatically with every change.

## Building a menu interface

```cpp
int choice;
do {
    std::cout << "\n1. Add product\n2. Sell\n3. Restock\n4. Report\n5. Reorder list\n0. Exit\nChoice: ";
    std::cin >> choice;
    switch (choice) {
        case 1: /* read details, inv.add(...) */ break;
        case 2: /* read code and qty, inv.sell(...) inside try/catch */ break;
        case 4: inv.report(); break;
        case 0: inv.save("stock.csv"); break;
        default: std::cout << "Invalid choice\n";
    }
} while (choice != 0);
```

## Ideas for extending the project

1. **Categories** and a report per category.
2. **Purchase orders**: generate a list of items to reorder with suggested quantities.
3. **Expiry dates** for pharmacies and supermarkets, with alerts for items expiring soon.
4. **User roles**: only managers can change prices.
5. **Barcodes**: read product codes from a barcode scanner (it types like a keyboard).
6. **Sales report by day** using `<chrono>` for dates.
7. **Graphical interface** with Qt, or expose the inventory as a web API.

## What this project shows employers

- Clear class design with encapsulation.
- Correct use of standard containers (`map`, `vector`).
- Error handling with exceptions instead of crashing or silently failing.
- File persistence and testing.
- Code organised so features can be added without rewriting everything.

## Practice

1. Add a `restock(code, qty)` method with validation.
2. Add a `report()` that prints all items with value (price × qty) and the total stock value.
3. Implement `save` and `load` with CSV files and test that data survives a restart.
4. Write three assert-based tests for selling and restocking rules.
5. Add a menu loop so a user can interact with the inventory.

:::think Why does the inventory throw exceptions for invalid sales instead of just printing an error message inside `sell()`?
Printing inside `sell()` mixes business logic with user interface and lets the caller continue as if the sale succeeded. Throwing an exception forces the caller to handle the failure: a console menu can print a message, a web API can return an error response, and tests can check that invalid operations are rejected, all without changing `Inventory`.
:::

```quiz
Q: Which container stores products by their code here?
A: map | std::map
Q: Which exception type is thrown for an unknown product code?
A: invalid_argument | std::invalid_argument
Q: What does const after report() promise?
A: it doesn't change the object | doesn't modify | no changes | read-only
Q: Which header provides setw and setprecision?
A: iomanip | <iomanip>
Q: Which C++17 feature unpacks a map entry into named variables like [code, item]? (two words)
A: structured binding | structured bindings
Q: Which header provides ifstream and ofstream?
A: fstream | <fstream>
Q: Which macro from cassert checks a condition in simple tests?
A: assert
```
