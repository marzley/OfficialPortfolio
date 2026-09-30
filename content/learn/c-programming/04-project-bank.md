---
slug: project-bank-system
title: Project: a mini bank / SACCO account system in C
---
# Project: a mini bank / SACCO account system in C

Let's combine everything from the C tutorial (variables, functions, arrays, strings, structs and pointers) into a small but complete program: a SACCO account system that opens accounts, handles deposits and withdrawals with rules, and prints statements.

## Design first

**Data:** each account has a number, a member name, a balance and a count of transactions.

**Operations:**

| Function | Rule |
|---|---|
| `openAccount` | Minimum opening deposit KSh 500 |
| `deposit` | Amount must be positive |
| `withdraw` | Must leave at least KSh 100; withdrawals cost a KSh 30 fee |
| `transfer` | Withdraw from one, deposit to another (no fee inside the SACCO) |
| `printAll` | A neat table of all accounts |

## The program

```try-c
#include <stdio.h>
#include <string.h>

#define MAX_ACCOUNTS 10
#define MIN_OPENING 500.0
#define MIN_BALANCE 100.0
#define WITHDRAW_FEE 30.0

struct Account {
    int number;
    char name[40];
    double balance;
    int transactions;
};

struct Account accounts[MAX_ACCOUNTS];
int accountCount = 0;

struct Account *findAccount(int number) {
    for (int i = 0; i < accountCount; i++) {
        if (accounts[i].number == number) return &accounts[i];
    }
    return NULL;
}

int openAccount(char *name, double deposit) {
    if (accountCount >= MAX_ACCOUNTS) { printf("Error: bank is full\n"); return -1; }
    if (deposit < MIN_OPENING) { printf("Error: minimum opening deposit is %.0f\n", MIN_OPENING); return -1; }
    struct Account *a = &accounts[accountCount];
    a->number = 1001 + accountCount;
    strncpy(a->name, name, sizeof(a->name) - 1);
    a->name[sizeof(a->name) - 1] = '\0';
    a->balance = deposit;
    a->transactions = 1;
    accountCount++;
    printf("Opened %d for %s with KSh %.2f\n", a->number, a->name, deposit);
    return a->number;
}

int deposit(int number, double amount) {
    struct Account *a = findAccount(number);
    if (a == NULL) { printf("Error: account %d not found\n", number); return 0; }
    if (amount <= 0) { printf("Error: deposit must be positive\n"); return 0; }
    a->balance += amount;
    a->transactions++;
    printf("Deposited KSh %.2f to %d. New balance %.2f\n", amount, number, a->balance);
    return 1;
}

int withdraw(int number, double amount, double fee) {
    struct Account *a = findAccount(number);
    if (a == NULL) { printf("Error: account %d not found\n", number); return 0; }
    if (amount <= 0) { printf("Error: amount must be positive\n"); return 0; }
    if (a->balance - amount - fee < MIN_BALANCE) {
        printf("Refused: %d must keep at least KSh %.0f (balance %.2f)\n", number, MIN_BALANCE, a->balance);
        return 0;
    }
    a->balance -= amount + fee;
    a->transactions++;
    printf("Withdrew KSh %.2f from %d (fee %.0f). New balance %.2f\n", amount, number, fee, a->balance);
    return 1;
}

int transfer(int from, int to, double amount) {
    if (findAccount(to) == NULL) { printf("Error: account %d not found\n", to); return 0; }
    if (!withdraw(from, amount, 0)) return 0;
    return deposit(to, amount);
}

void printAll(void) {
    double total = 0;
    printf("\n%-6s %-15s %12s %6s\n", "No.", "Member", "Balance", "Trans");
    printf("------------------------------------------\n");
    for (int i = 0; i < accountCount; i++) {
        printf("%-6d %-15s %12.2f %6d\n", accounts[i].number, accounts[i].name, accounts[i].balance, accounts[i].transactions);
        total += accounts[i].balance;
    }
    printf("------------------------------------------\n");
    printf("%-22s %12.2f\n", "Total savings", total);
}

int main(void) {
    int amina = openAccount("Amina Hassan", 2000);
    int brian = openAccount("Brian Otieno", 800);
    openAccount("Chebet", 200);                 /* refused: too small */

    deposit(amina, 3500);
    withdraw(brian, 650, WITHDRAW_FEE);         /* refused: would go below the minimum */
    withdraw(brian, 500, WITHDRAW_FEE);
    transfer(amina, brian, 1000);
    deposit(9999, 100);                         /* no such account */

    printAll();
    return 0;
}
```

## How it's built

| C concept | Where |
|---|---|
| `#define` constants for the rules | top of the file |
| `struct` | `struct Account` |
| Array of structs | `accounts[MAX_ACCOUNTS]` |
| Pointers to structs and `->` | `findAccount`, every operation |
| Returning `NULL` for "not found" | `findAccount` |
| Functions returning success (1) / failure (0) | `deposit`, `withdraw` |
| Reusing functions | `transfer` uses `withdraw` and `deposit` |
| Formatted tables | `printAll` with `%-15s`, `%12.2f` |

## Challenges

1. Add a menu loop with `scanf` so a user can choose operations.
2. Add monthly interest (e.g. 0.5%) to every account.
3. Keep a history of each account's transactions and print a mini statement.
4. Save accounts to a file with `fopen`/`fprintf` and load them on start.
5. Allow up to any number of accounts using `malloc`/`realloc` instead of a fixed array.

```quiz
Q: What does findAccount return when the account doesn't exist?
A: NULL
Q: Which operator accesses a struct field through a pointer?
A: -> | arrow
Q: What is the minimum opening deposit in this program, in KSh?
A: 500
Q: Which printf specifier left-aligns a string in 15 characters?
A: %-15s
```
