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

```quiz
Q: Which container stores products by their code here?
A: map | std::map
Q: Which exception type is thrown for an unknown product code?
A: invalid_argument | std::invalid_argument
Q: What does const after report() promise?
A: it doesn't change the object | doesn't modify | no changes | read-only
Q: Which header provides setw and setprecision?
A: iomanip | <iomanip>
```
