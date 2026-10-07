---
slug: inventory-system
title: "Project 5: Inventory and sales system for a shop (stock, sales, low-stock alerts, reports)"
after: blog-cms
---
# Project 5: Inventory and sales system for a shop

Hardware shops, chemists, agro-vets, spare-parts dealers, cosmetics shops and mini-marts all struggle with the same questions: *How much stock do we have? What's running out? What sold today? Is anyone stealing?* An inventory system answers them. It's one of the most useful systems you can build for Kenyan small businesses, and one of the best for learning **database design and transactions**.

**You'll practise:** relational design, stock movements, SQL transactions, roles (owner vs cashier), reports with GROUP BY, CSV export.

**Lessons you need:** [keys and design](./?track=sql&lesson=keys-design), [indexes and transactions](./?track=sql&lesson=indexes-transactions), [JOINs](./?track=sql&lesson=joins), [GROUP BY](./?track=sql&lesson=functions-group), [CRUD app](./?track=php&lesson=crud-app), [sessions and login](./?track=php&lesson=sessions-login). The [C++ inventory project](./?track=cpp&lesson=project-inventory) shows the same ideas in a console program.

## Step 1: Features

**Owner (admin):** add products and suppliers, record stock received, see stock levels, low-stock list, daily/monthly sales reports, profit per product, manage users.

**Cashier:** search a product, record a sale (several items), choose payment method (cash / M-Pesa), print or share a receipt.

**System:** never let stock go below zero; keep a full history of every stock change (who, what, when, why).

## Step 2: The key design idea: stock movements

A beginner design stores `quantity` in the products table and changes it directly. The problem: when the number is wrong, you have **no idea why**.

Professional systems record every change as a **stock movement**: +50 received from a supplier, −3 sold, −1 damaged, +2 returned. The current stock is the **sum of movements**. You can also keep a cached `stock` column for speed, as long as it's always updated in the same transaction as the movement.

```text
products 1───* stock_movements *───1 users
    │
    *───1 suppliers
sales 1───* sale_items *───1 products
```

## Step 3: Tables

Here is a SQLite version you can run right now. It creates the tables, adds products, records stock received and two sales, then answers the questions an owner asks:

```try-sql
CREATE TABLE suppliers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT);
CREATE TABLE items (
  id INTEGER PRIMARY KEY, sku TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  cost INTEGER NOT NULL, price INTEGER NOT NULL, reorder_level INTEGER NOT NULL DEFAULT 5
);
CREATE TABLE stock_moves (
  id INTEGER PRIMARY KEY, item_id INTEGER NOT NULL REFERENCES items(id),
  change INTEGER NOT NULL, reason TEXT NOT NULL CHECK (reason IN ('received','sold','damaged','returned','count')),
  moved_at TEXT NOT NULL
);
CREATE TABLE sales (id INTEGER PRIMARY KEY, sold_at TEXT NOT NULL, payment TEXT NOT NULL);
CREATE TABLE sale_lines (sale_id INTEGER REFERENCES sales(id), item_id INTEGER REFERENCES items(id), qty INTEGER NOT NULL, price INTEGER NOT NULL);

INSERT INTO suppliers VALUES (1, 'Kamili Hardware Distributors', '0700000001');
INSERT INTO items VALUES
 (1, 'CEM-50', 'Cement 50kg', 1, 720, 820, 10),
 (2, 'NAIL-3', 'Nails 3 inch (1kg)', 1, 180, 250, 5),
 (3, 'PNT-4L', 'Paint white 4L', 1, 1900, 2400, 3);
INSERT INTO stock_moves (item_id, change, reason, moved_at) VALUES
 (1, 40, 'received', '2026-03-01'), (2, 20, 'received', '2026-03-01'), (3, 6, 'received', '2026-03-01');
INSERT INTO sales VALUES (1, '2026-03-02', 'M-Pesa'), (2, '2026-03-02', 'Cash');
INSERT INTO sale_lines VALUES (1, 1, 25, 820), (1, 2, 4, 250), (2, 3, 4, 2400), (2, 2, 13, 250);
INSERT INTO stock_moves (item_id, change, reason, moved_at) VALUES
 (1, -25, 'sold', '2026-03-02'), (2, -4, 'sold', '2026-03-02'), (3, -4, 'sold', '2026-03-02'), (2, -13, 'sold', '2026-03-02'),
 (3, -1, 'damaged', '2026-03-03');

-- Current stock and what needs re-ordering
SELECT i.name, SUM(m.change) AS in_stock, i.reorder_level,
       CASE WHEN SUM(m.change) <= i.reorder_level THEN 'REORDER' ELSE 'ok' END AS status
FROM items i JOIN stock_moves m ON m.item_id = i.id
GROUP BY i.id
ORDER BY status DESC, i.name;
```

Now the sales report: revenue and profit per product. Paste this under the code above (all of it must run together, because each run starts with a fresh database):

```sql
SELECT i.name, SUM(l.qty) AS units, SUM(l.qty * l.price) AS revenue,
       SUM(l.qty * (l.price - i.cost)) AS profit
FROM sale_lines l JOIN items i ON i.id = l.item_id
GROUP BY i.id
ORDER BY profit DESC;
```

In MySQL for the real app, use `INT AUTO_INCREMENT PRIMARY KEY`, `DECIMAL(10,2)` for money (or store whole shillings as integers, as here), `DATETIME` and a `user_id` column on movements and sales.

## Step 4: Recording a sale safely (transactions)

A sale touches several tables: one `sales` row, several `sale_items`, and a stock movement for each item. If the power goes off half-way, you must not end up with a sale but no stock change. That's what **transactions** are for: all the statements succeed, or none of them do.

```php
<?php
function record_sale(PDO $pdo, int $userId, string $payment, array $cart): int {
    // $cart = [['item_id' => 1, 'qty' => 2], ...]
    $pdo->beginTransaction();
    try {
        $pdo->prepare('INSERT INTO sales (user_id, payment, sold_at) VALUES (?, ?, NOW())')->execute([$userId, $payment]);
        $saleId = (int)$pdo->lastInsertId();
        foreach ($cart as $line) {
            // Lock the product row so two cashiers can't sell the last item twice
            $stmt = $pdo->prepare('SELECT price, stock FROM items WHERE id = ? FOR UPDATE');
            $stmt->execute([$line['item_id']]);
            $item = $stmt->fetch();
            if (!$item || $item['stock'] < $line['qty']) throw new RuntimeException('Not enough stock');
            $pdo->prepare('INSERT INTO sale_items (sale_id, item_id, qty, price) VALUES (?, ?, ?, ?)')
                ->execute([$saleId, $line['item_id'], $line['qty'], $item['price']]);
            $pdo->prepare('INSERT INTO stock_moves (item_id, user_id, `change`, reason, moved_at) VALUES (?, ?, ?, "sold", NOW())')
                ->execute([$line['item_id'], $userId, -$line['qty']]);
            $pdo->prepare('UPDATE items SET stock = stock - ? WHERE id = ?')->execute([$line['qty'], $line['item_id']]);
        }
        $pdo->commit();
        return $saleId;
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}
```

Notes:
- The **price is copied into `sale_items`** at the time of sale. If the price changes next month, old receipts still show what the customer actually paid.
- `FOR UPDATE` locks the row inside the transaction (MySQL InnoDB), preventing two simultaneous sales of the last bag of cement.
- `change` is a reserved word in MySQL, hence the backticks. Calling the column `qty_change` avoids that.

## Step 5: Roles and permissions

Add `role ENUM('owner','cashier')` to users. Check it on the **server** for every protected page and action:

```php
function require_role(string $role): void {
    if (($_SESSION['role'] ?? '') !== $role) { http_response_code(403); exit('Not allowed'); }
}
// reports.php
require_role('owner');
```

Hiding a button in the HTML is not security; a cashier could still type the URL. The server must check.

## Step 6: The cashier screen

Make it fast to use on a cheap tablet or phone:
- A search box that filters products as you type (JavaScript `fetch` to `search.php?q=cem` returning JSON).
- A cart list with + / − buttons and a running total.
- Payment buttons: **Cash** and **M-Pesa** (record the M-Pesa transaction code the customer shows, or integrate STK push later: see the [M-Pesa project](./?track=projects&lesson=mpesa-payment-system)).
- After saving: a receipt page that prints on a small thermal printer (CSS `@media print` with `width: 58mm` or `80mm`) or can be shared on WhatsApp.

## Step 7: Reports for the owner

| Report | SQL idea |
|---|---|
| Today's sales by payment method | `SUM(qty*price) ... WHERE DATE(sold_at)=CURDATE() GROUP BY payment` |
| Best sellers this month | `GROUP BY item_id ORDER BY SUM(qty) DESC LIMIT 10` |
| Profit per product | `SUM(qty*(price-cost))` (as above) |
| Low stock | `WHERE stock <= reorder_level` |
| Dead stock (no sales in 60 days) | `LEFT JOIN` recent sales, `WHERE sale is NULL` |
| Cashier summary | `GROUP BY user_id` per day: helps spot problems |
| Stock-take differences | Movements with reason `count` |

Add **Export to CSV** so the owner can open reports in Excel:

```php
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="sales-' . date('Y-m-d') . '.csv"');
$out = fopen('php://output', 'w');
fputcsv($out, ['Product', 'Units', 'Revenue']);
foreach ($rows as $r) fputcsv($out, [$r['name'], $r['units'], $r['revenue']]);
```

## Step 8: Stock-take

Once a month the owner counts everything physically. Build a page listing each product with the system quantity and a box for the counted quantity. Saving records a `count` movement for the difference (e.g. −2) so stock matches reality and the history shows the loss.

## Step 9: Test it like a shop would

- Sell more than is in stock: must be refused.
- Two browser windows selling the last item at the same time.
- Cashier tries to open `reports.php`: must get 403.
- Change a price, then check an old receipt still shows the old price.
- 1,000 products: is search still fast? (Add an index on `name` and `sku`.)

## Stretch goals

- Barcode scanning: USB barcode scanners type like a keyboard, so focus the search box and press Enter.
- Purchase orders to suppliers generated from the low-stock list.
- Multiple branches (`branch_id` on stock movements and sales).
- Daily summary sent to the owner by email or SMS.
- An offline-first version (PWA) for shops with unreliable internet.

## Summary

- Record every stock change as a movement; current stock is their sum.
- Use transactions so a sale is all-or-nothing, and row locks to avoid selling the same item twice.
- Copy the price into sale lines; check roles on the server.
- Reports with GROUP BY and CSV export make the system valuable to owners.

```quiz
Q: Which SQL feature makes several statements succeed or fail together?
A: transaction | transactions | a transaction
Q: Which MySQL clause locks the selected rows until the transaction ends? (two words)
A: FOR UPDATE
Q: Why copy the price into the sale lines table? So old receipts keep the price the customer actually ___ (one word)
A: paid
Q: Where must role checks happen: in the browser or on the server?
A: server | on the server | the server
```
