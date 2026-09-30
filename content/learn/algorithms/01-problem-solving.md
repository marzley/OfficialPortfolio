---
slug: problem-solving-steps
title: How to solve programming problems step by step
after: pseudocode-flowcharts
---
# How to solve programming problems step by step

Beginners often stare at a blank editor. Experienced programmers don't know the answer instantly either: they follow a **process**. Use this one for exercises, exams and job interviews.

## The 6-step method

1. **Understand** the problem. Restate it in your own words. What are the inputs and outputs?
2. **Examples**: work 2–3 examples by hand, including an unusual one (empty list, zero, negative).
3. **Break it down** into small steps (pseudocode).
4. **Code** one small step at a time, running as you go.
5. **Test** with your examples and edge cases.
6. **Improve**: tidy names, remove repetition, think about speed.

## Worked example: "Find the second-highest mark"

**1. Understand.** Input: a list of marks. Output: the second-highest *different* mark.

**2. Examples.**

| Input | Output | Note |
|---|---|---|
| [45, 78, 92, 60] | 78 | normal |
| [90, 90, 85] | 85 | duplicates of the top mark |
| [70] | None | only one mark |
| [] | None | empty |

**3. Break it down (pseudocode).**

```
remove duplicates
if fewer than 2 marks: return nothing
sort from highest to lowest
return the second one
```

**4 & 5. Code and test.**

```try-python
def second_highest(marks):
    unique = sorted(set(marks), reverse=True)
    if len(unique) < 2:
        return None
    return unique[1]

tests = [([45, 78, 92, 60], 78), ([90, 90, 85], 85), ([70], None), ([], None)]
for marks, expected in tests:
    result = second_highest(marks)
    print(marks, "->", result, "OK" if result == expected else f"FAIL (expected {expected})")
```

**6. Improve.** Sorting is fine for a class list. For millions of numbers we could scan once, keeping the top two:

```try-python
def second_highest_fast(marks):
    first = second = None
    for m in marks:
        if first is None or m > first:
            first, second = m, first
        elif m != first and (second is None or m > second):
            second = m
    return second

print(second_highest_fast([45, 78, 92, 60]), second_highest_fast([90, 90, 85]), second_highest_fast([70]))
```

## Strategies when you're stuck

| Strategy | How it helps |
|---|---|
| **Solve it by hand** | Write out exactly what *you* do; that's the algorithm |
| **Simplify** | Solve for a list of 2 items first, then generalise |
| **Work backwards** | Start from the output you need |
| **Look for a pattern** | Print intermediate values and look |
| **Use known building blocks** | Counting, summing, searching, sorting, filtering |
| **Draw it** | Boxes and arrows for lists, trees, networks |
| **Rubber duck** | Explain your code line by line out loud |
| **Take a break** | Many solutions appear after a short walk |

## Common building blocks (patterns)

```try-python
nums = [4, 9, 2, 9, 7]

total = 0                      # accumulate
for n in nums: total += n

count_nines = 0                # count
for n in nums:
    if n == 9: count_nines += 1

biggest = nums[0]              # track the best so far
for n in nums:
    if n > biggest: biggest = n

seen, dupes = set(), set()     # detect duplicates with a set
for n in nums:
    if n in seen: dupes.add(n)
    seen.add(n)

print(total, count_nines, biggest, dupes)
```

Most beginner problems are a combination of these.

## Practice sites

Start easy and practise a little every day: our Python and Algorithms exercises, then sites like Exercism, HackerRank, LeetCode (Easy level), Codewars and Kenya's own hackathons and competitions.

```quiz
Q: What is the first step in solving a problem?
A: understand | understand the problem
Q: What do we call unusual inputs like an empty list or zero? (two words, hyphen allowed)
A: edge cases | edge case | edge-cases
Q: Which Python type removes duplicates quickly?
A: set
Q: What informal plan written in plain words comes before code?
A: pseudocode
```
=== exercise ===
Write `count_even(nums)` that returns how many numbers in the list are even, and print `count_even([4, 7, 10, 3, 8])`. Output: **3**.
=== starter ===
def count_even(nums):
    pass

print(count_even([4, 7, 10, 3, 8]))
=== expected ===
3
=== must_contain ===
def count_even
% 2
