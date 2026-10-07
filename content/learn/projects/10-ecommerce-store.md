---
slug: ecommerce-store
title: "Project 9: E-commerce store with cart, M-Pesa checkout, orders and admin"
after: booking-system
---
# Project 9: E-commerce store with cart, M-Pesa checkout, orders and admin

Online shops are among the most requested projects in Kenya: fashion boutiques, phone accessories, cosmetics, books, farm produce, electronics, crafts and furniture. In this project you build a complete store: product catalogue with search and categories, a cart, checkout with delivery options, M-Pesa payment, order tracking and an admin dashboard.

This is a **large** project. Build it in the phases below and commit after each one.

**You'll practise:** relational design with many tables, sessions, money calculations, transactions, payment integration, admin roles, image handling and SEO for products.

**Lessons you need:** [the blog project](./?track=projects&lesson=blog-cms) (CRUD, login, uploads, security), [the inventory project](./?track=projects&lesson=inventory-system) (stock, transactions), [the M-Pesa project](./?track=projects&lesson=mpesa-payment-system), [local storage](./?track=javascript&lesson=local-storage), [ecommerce in Kenya](./?track=make-money-online&lesson=ecommerce-dropshipping-kenya).

## Phase 1: Plan

| Area | Must | Should / Could |
|---|---|---|
| Catalogue | Products with photos, price, stock, categories; search | Variants (size, colour), reviews, related products |
| Cart | Add, change quantity, remove, totals | Saved carts for logged-in customers, coupons |
| Checkout | Name, phone, delivery option and location; M-Pesa STK push | Pay on delivery, card payments |
| Orders | Order confirmation page and SMS/email; order status | Customer accounts with order history; tracking page by order number |
| Admin | Manage products, see and update orders, low stock | Sales reports, customer list, discount codes |

## Phase 2: Database

```sql
CREATE TABLE categories (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL, slug VARCHAR(80) NOT NULL UNIQUE);
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY, category_id INT, name VARCHAR(150) NOT NULL, slug VARCHAR(160) NOT NULL UNIQUE,
  description TEXT, price INT NOT NULL, stock INT NOT NULL DEFAULT 0, image VARCHAR(255),
  active TINYINT NOT NULL DEFAULT 1, created_at DATETIME NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL, FULLTEXT (name, description)
);
CREATE TABLE delivery_zones (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL, fee INT NOT NULL, days VARCHAR(30));
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY, ref CHAR(8) NOT NULL UNIQUE,
  customer VARCHAR(100) NOT NULL, phone VARCHAR(15) NOT NULL, email VARCHAR(190),
  zone_id INT NOT NULL, address VARCHAR(255) NOT NULL,
  subtotal INT NOT NULL, delivery_fee INT NOT NULL, total INT NOT NULL,
  status ENUM('pending_payment','paid','packed','dispatched','delivered','cancelled') NOT NULL DEFAULT 'pending_payment',
  created_at DATETIME NOT NULL, FOREIGN KEY (zone_id) REFERENCES delivery_zones(id)
);
CREATE TABLE order_items (
  order_id INT NOT NULL, product_id INT NOT NULL, name VARCHAR(150) NOT NULL, price INT NOT NULL, qty INT NOT NULL,
  PRIMARY KEY (order_id, product_id), FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
-- plus the payments table from the M-Pesa project, with order_ref = orders.ref
```

Money is stored as **whole shillings in integers** (or `DECIMAL(10,2)` if you need cents). Never use floating-point types for money: `0.1 + 0.2` is not exactly `0.3` in most programming languages.

`order_items` copies the product **name and price** at the time of purchase, so editing a product later never changes old orders.

Delivery zones fit Kenya well: e.g. "Nairobi CBD (pick-up point)", "Nairobi estates", "Outside Nairobi via courier/matatu parcel", each with a fee and an estimated time.

## Phase 3: Catalogue pages

- **Home**: featured products, categories, a search box.
- **Category page**: `/category.php?slug=phone-accessories`, with sorting (newest, price low to high) and pagination.
- **Product page**: `/product.php?slug=...` with large photo, price, stock status ("Only 3 left"), description, **Add to cart**, and a WhatsApp "Ask about this product" link.
- **Search**: `MATCH(name, description) AGAINST (? IN NATURAL LANGUAGE MODE)` with the FULLTEXT index, or `LIKE` for small shops.

Images: resize uploads to a few sizes (e.g. 400px and 1000px wide) and serve WebP; product listing pages load many images, and most customers are on mobile data.

## Phase 4: The cart

Where to keep the cart? Two common options:
- **Server session** (`$_SESSION['cart'] = [productId => qty]`): simple and secure.
- **localStorage** in the browser: works without logging in and survives closing the browser; the server re-checks everything at checkout.

Either way, the **server recalculates all prices and totals at checkout** from the database. The browser's numbers are only for display.

Here's the cart total logic. Run it, then try adding a coupon or changing the zone:

```try-javascript
const PRODUCTS = { 1: { name: "Phone case", price: 650, stock: 12 }, 2: { name: "USB-C cable", price: 450, stock: 3 }, 3: { name: "Power bank 10000mAh", price: 2800, stock: 5 } };
const ZONES = { cbd: { name: "Nairobi CBD pick-up", fee: 0 }, estates: { name: "Nairobi estates", fee: 250 }, upcountry: { name: "Outside Nairobi (courier)", fee: 450 } };
const FREE_DELIVERY_FROM = 5000;

function priceCart(cart, zoneKey) {
  const lines = [], problems = [];
  for (const [id, qty] of Object.entries(cart)) {
    const p = PRODUCTS[id];
    if (!p) { problems.push("Product " + id + " no longer exists"); continue; }
    const q = Math.max(1, Math.floor(qty));
    if (q > p.stock) problems.push("Only " + p.stock + " " + p.name + " left");
    lines.push({ name: p.name, qty: Math.min(q, p.stock), lineTotal: Math.min(q, p.stock) * p.price });
  }
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const zone = ZONES[zoneKey];
  const delivery = !zone ? null : subtotal >= FREE_DELIVERY_FROM ? 0 : zone.fee;
  if (!zone) problems.push("Choose a delivery option");
  return { lines, subtotal, delivery, total: subtotal + (delivery || 0), problems };
}

const result = priceCart({ 1: 2, 2: 5, 3: 1 }, "estates");
result.lines.forEach(l => console.log(l.qty + " x " + l.name + " = KSh " + l.lineTotal.toLocaleString()));
console.log("Subtotal KSh " + result.subtotal.toLocaleString() + " | Delivery KSh " + result.delivery + " | Total KSh " + result.total.toLocaleString());
console.log("Problems:", result.problems);
```

Note the stock check caps the quantity and tells the customer, instead of failing silently.

## Phase 5: Checkout and payment

1. Checkout form: name, phone (normalised to `2547…`), optional email, delivery zone, address or pick-up point, notes.
2. On submit (server, inside a **transaction**): re-price the cart from the database, check stock with `SELECT … FOR UPDATE`, create the `orders` row (`pending_payment`) and `order_items`, generate an order reference.
3. Send the **STK push** for `orders.total` (from the database).
4. Show a waiting screen that polls payment status (exactly as in the [M-Pesa project](./?track=projects&lesson=mpesa-payment-system)).
5. On payment confirmation: mark the order `paid`, **reduce stock**, and send confirmation by SMS/email.
6. Unpaid orders older than, say, 30 minutes are cancelled by a cron job (and if you reserved stock at checkout, it's released).

Decide **when stock is reduced**: at payment (simple; tiny risk of overselling in a rush) or at checkout with a reservation that expires (more complex; no overselling). For a small shop, reducing at payment and handling the rare clash by refunding is acceptable; explain your choice in the README.

## Phase 6: Order tracking and notifications

- Confirmation page: order number, items, total, delivery details, M-Pesa receipt.
- Tracking page: enter order number + phone → see status (paid → packed → dispatched → delivered).
- Each status change can send an SMS/email ("Your order MZ7K2Q9A has been dispatched with G4S, tracking …").

## Phase 7: Admin dashboard

- Today's orders and revenue, orders awaiting packing, low stock.
- Orders list with filters by status; order detail page with buttons to move to the next status.
- Product management (from the blog project's CRUD pattern), with image upload and stock editing.
- Sales report: revenue by day and top products (SQL from the [inventory project](./?track=projects&lesson=inventory-system)).
- Export orders to CSV for accounting.

Protect all admin pages with login and role checks on the server.

## Phase 8: SEO and trust

- Each product page: unique title (`Anker 10000mAh Power Bank | Price in Kenya | ShopName`), description, `og:image`, and **Product** structured data (name, image, price, `priceCurrency: KES`, availability).
- Clear policies: delivery times and fees, returns and refunds, contact details, physical location if any. Kenyan buyers are cautious; a visible phone number, WhatsApp, real photos and honest delivery times build trust.
- If you collect personal data, add a privacy notice in line with the Data Protection Act ([data protection in Kenya](./?track=cybersecurity&lesson=data-protection-kenya)).

## Phase 9: Testing checklist

- Change a price in DevTools before checkout: total from the server is unchanged
- Buy more than the stock: refused or capped with a message
- Payment cancelled: order stays `pending_payment`; customer can retry
- Duplicate payment callback: order paid once, stock reduced once
- Admin pages without login: redirected; customer can't view another customer's order by changing the reference
- Mobile: whole flow works on a small phone with slow internet

## Stretch goals

- Product variants (size/colour) with their own stock: a `product_variants` table.
- Discount codes with expiry and usage limits.
- Customer accounts and wishlists.
- Abandoned cart reminders (only with consent).
- Turn it into a **multi-vendor marketplace** (vendors, commissions, payouts with M-Pesa B2C): an advanced project.

:::tip WooCommerce vs custom
For many real small shops, **WordPress + WooCommerce** with an M-Pesa plugin is faster and cheaper to deliver. Building your own store teaches you how everything works underneath, which makes you better at both. Choose per client; see [WordPress basics](./?track=hosting&lesson=wordpress-basics).
:::

## Summary

- Many tables: products, categories, orders, order items, delivery zones, payments.
- Integers for money; copy name and price into order items.
- The server re-prices everything at checkout; stock checks and order creation happen in a transaction.
- Payment via STK push with idempotent callbacks; cron cancels unpaid orders.
- Admin, SEO, clear policies and good mobile UX make it a real shop.

```quiz
Q: Should you store money in a floating-point column? (yes or no)
A: no
Q: Who calculates the final total: the browser or the server?
A: server | the server
Q: What is the currency code for the Kenyan shilling?
A: KES
Q: What status does a new order have before payment? (as in the table)
A: pending_payment | pending payment
```
