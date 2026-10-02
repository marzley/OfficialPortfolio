---
slug: project-todo
title: "Project: build a complete to-do list app, step by step"
after: KEEP
---
# Project: build a complete to-do list app, step by step

A to-do list is the classic first JavaScript app because it uses almost everything you've learned: arrays of objects, functions, the DOM, events, forms, filtering and saving data. In this project you'll build a polished, accessible to-do app the way professionals structure apps: **state → render → events**. The same pattern scales up to shopping carts, chat lists and dashboards (and it's the core idea behind React).

:::note What you will practise
- Planning features and data before coding
- Keeping app **state** in one array of objects
- A `render()` function that draws the UI from state
- Adding, completing, editing and deleting tasks
- Filters (all, active, done) and counters
- Event delegation for dynamic lists
- Saving to localStorage (with a safe fallback)
- Accessibility details
:::

## Step 1: Plan the features

| Feature | Detail |
|---|---|
| Add a task | Type and press Enter or click Add; ignore empty input |
| Complete a task | Checkbox toggles done; done tasks are struck through |
| Delete a task | ✕ button |
| Edit a task | Double-click (or an Edit button) to rename |
| Filter | All / Active / Done |
| Counter | "3 tasks left" |
| Clear completed | Removes all done tasks |
| Remember | Tasks survive a page reload |

## Step 2: Design the data (state)

```
let tasks = [
  { id: 1, text: "Pay electricity token", done: false },
  { id: 2, text: "Buy unga and sugar", done: true },
];
let filter = "all";   // "all" | "active" | "done"
```

Every task has a unique `id` (so we can find it even if two tasks have the same text), the `text`, and `done`.

## Step 3: The core idea: state → render → events

1. **State** is the single source of truth (the `tasks` array and `filter`).
2. **`render()`** reads state and redraws the list. It never decides anything else.
3. **Events** (clicks, typing) **change state**, save it, then call `render()`.

This avoids the classic beginner bug where the page and the data get out of sync.

## Step 4: The logic, tested on its own

Pure functions (no DOM) are easy to test. Run this:

```try-javascript
let nextId = 1;
const addTask = (tasks, text) => {
  const clean = text.trim();
  if (!clean) return tasks;                              // ignore empty input
  return [...tasks, { id: nextId++, text: clean, done: false }];
};
const toggleTask = (tasks, id) => tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
const deleteTask = (tasks, id) => tasks.filter((t) => t.id !== id);
const visible = (tasks, filter) =>
  filter === "active" ? tasks.filter((t) => !t.done) : filter === "done" ? tasks.filter((t) => t.done) : tasks;
const leftCount = (tasks) => tasks.filter((t) => !t.done).length;

let tasks = [];
tasks = addTask(tasks, "Pay electricity token");
tasks = addTask(tasks, "  Buy unga  ");
tasks = addTask(tasks, "   ");                            // ignored
tasks = toggleTask(tasks, 1);
console.log(tasks);
console.log("Active:", visible(tasks, "active").map((t) => t.text));
console.log("Left:", leftCount(tasks));
tasks = deleteTask(tasks, 1);
console.log("After delete:", tasks.map((t) => t.text));
```

Notice these functions **return new arrays** instead of changing the old one (immutability). That makes bugs rarer and is how React apps manage state.

## Step 5: The complete app

```try-html
<style>
  body { font-family: system-ui, sans-serif; background: #f1f5f9; }
  .app { max-width: 420px; margin: 12px auto; background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 6px 24px rgb(15 23 42 / 8%); }
  .app h1 { margin: 0 0 12px; font-size: 22px; color: #0b1b35; }
  .add { display: flex; gap: 8px; }
  .add input { flex: 1; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 10px; font: inherit; }
  .add button, .bar button { padding: 10px 14px; border: 0; border-radius: 10px; background: #0b1b35; color: #fff; font: inherit; cursor: pointer; }
  ul { list-style: none; padding: 0; margin: 14px 0; }
  li { display: flex; align-items: center; gap: 10px; padding: 8px 4px; border-bottom: 1px solid #e2e8f0; }
  li .text { flex: 1; overflow-wrap: anywhere; }
  li.done .text { text-decoration: line-through; color: #94a3b8; }
  li input[type=checkbox] { width: 18px; height: 18px; accent-color: #059669; }
  .del { background: none; border: 0; color: #dc2626; font-size: 18px; cursor: pointer; }
  .bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: space-between; font-size: 14px; color: #475569; }
  .filters button { background: #e2e8f0; color: #0b1b35; padding: 6px 10px; }
  .filters button[aria-pressed=true] { background: #f59e0b; }
  .empty { color: #94a3b8; text-align: center; padding: 16px 0; }
  .edit { flex: 1; padding: 6px; font: inherit; }
</style>

<div class="app">
  <h1>My tasks</h1>
  <form class="add" id="add-form">
    <label for="new" class="sr-only" style="position:absolute;left:-9999px">New task</label>
    <input id="new" placeholder="What do you need to do?" autocomplete="off" maxlength="120">
    <button type="submit">Add</button>
  </form>
  <ul id="list" aria-live="polite"></ul>
  <div class="bar">
    <span id="left">0 tasks left</span>
    <span class="filters" role="group" aria-label="Filter tasks">
      <button data-filter="all" aria-pressed="true">All</button>
      <button data-filter="active" aria-pressed="false">Active</button>
      <button data-filter="done" aria-pressed="false">Done</button>
    </span>
    <button id="clear-done">Clear done</button>
  </div>
</div>

<script>
  // ----- state -----
  const KEY = "todo-app";
  let memory = null;
  function loadState() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { tasks: [], nextId: 1 }; }
    catch (e) { return memory || { tasks: [{ id: 1, text: "Try adding, ticking and deleting tasks", done: false }], nextId: 2 }; }
  }
  function saveState() {
    const data = { tasks, nextId };
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { memory = data; }
  }
  let { tasks, nextId } = loadState();
  let filter = "all";

  // ----- render: draw the UI from state -----
  const list = document.querySelector("#list");
  function render() {
    const shown = filter === "active" ? tasks.filter((t) => !t.done) : filter === "done" ? tasks.filter((t) => t.done) : tasks;
    list.replaceChildren();
    if (!shown.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = tasks.length ? "Nothing here for this filter." : "No tasks yet. Add one above!";
      list.append(li);
    }
    for (const t of shown) {
      const li = document.createElement("li");
      li.dataset.id = t.id;
      if (t.done) li.classList.add("done");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = t.done;
      box.setAttribute("aria-label", "Mark '" + t.text + "' as done");
      const span = document.createElement("span");
      span.className = "text";
      span.textContent = t.text;                    // textContent: safe from XSS
      span.title = "Double-click to edit";
      const del = document.createElement("button");
      del.className = "del";
      del.textContent = "✕";
      del.setAttribute("aria-label", "Delete '" + t.text + "'");
      li.append(box, span, del);
      list.append(li);
    }
    const left = tasks.filter((t) => !t.done).length;
    document.querySelector("#left").textContent = left + (left === 1 ? " task left" : " tasks left");
    document.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
  }

  // ----- events: change state, save, render -----
  document.querySelector("#add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("#new");
    const text = input.value.trim();
    if (!text) return input.focus();
    tasks.push({ id: nextId++, text, done: false });
    input.value = "";
    saveState(); render();
  });

  list.addEventListener("click", (e) => {               // event delegation
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.matches("input[type=checkbox]")) {
      tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    } else if (e.target.matches(".del")) {
      tasks = tasks.filter((t) => t.id !== id);
    } else return;
    saveState(); render();
  });

  list.addEventListener("dblclick", (e) => {            // edit on double-click
    const span = e.target.closest(".text");
    if (!span) return;
    const id = Number(span.closest("li").dataset.id);
    const input = document.createElement("input");
    input.className = "edit";
    input.value = span.textContent;
    span.replaceWith(input);
    input.focus();
    const finish = (keep) => {
      const text = input.value.trim();
      if (keep && text) tasks = tasks.map((t) => (t.id === id ? { ...t, text } : t));
      saveState(); render();
    };
    input.addEventListener("keydown", (k) => { if (k.key === "Enter") finish(true); if (k.key === "Escape") finish(false); });
    input.addEventListener("blur", () => finish(true));
  });

  document.querySelector(".filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.dataset.filter;
    render();
  });

  document.querySelector("#clear-done").addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done);
    saveState(); render();
  });

  render();
</script>
```

(In this sandboxed editor, storage is blocked, so tasks reset when you press Run; on your own computer they'll survive reloads.)

## Step 6: Understand every part

| Part | What it teaches |
|---|---|
| `loadState` / `saveState` | JSON + localStorage with a safe fallback |
| `render()` | Rebuilding the list from state; `textContent` for safety |
| `submit` handler | Forms, `preventDefault`, validation (`trim`) |
| Delegated `click` | One listener handles all items, even new ones |
| `dblclick` edit | Replacing elements, keyboard handling (Enter/Escape), `blur` |
| Filters | Deriving what to show from state; `aria-pressed` for toggle buttons |
| `aria-live` | Screen readers hear list updates |

:::think Why does the app rebuild the whole list in render() instead of changing just the one task that was clicked?
Rebuilding from state keeps the screen and the data always in sync, with very little code. For small lists it's fast enough. Big apps optimise by updating only what changed; that's exactly what libraries like React do for you automatically (comparing old and new UI and updating the minimum).
:::

## Step 7: Extension challenges

1. **Due dates:** add a date input; show overdue tasks in red.
2. **Priorities:** High/Medium/Low with sorting.
3. **Search box** that filters tasks as you type.
4. **Drag and drop** reordering (HTML Drag and Drop API or a library like SortableJS).
5. **Categories** (Home, School, Business) with colour labels.
6. **Sync to a server:** save tasks through an API (the APIs & backends subject) so they appear on every device after login.
7. **Make it a PWA** (installable, works offline).

## Common mistakes in this project

| Mistake | Fix |
|---|---|
| Changing the DOM but not the state | Always change state, then render |
| Using text to identify tasks | Use unique ids |
| `innerHTML` with task text | `textContent` (prevents XSS) |
| Adding a listener per item | Event delegation |
| Forgetting `preventDefault` on the form | The page reloads |
| Crashing when storage is blocked | `try...catch` fallback |

## Summary

- Plan features and data first; store state in one place (`tasks`, `filter`).
- `render()` draws UI from state; events change state, save it and re-render.
- Use pure functions for logic, `textContent` for safety, event delegation for dynamic lists, and localStorage with a fallback for persistence.
- Accessibility: labels, `aria-pressed`, `aria-live`, real buttons.
- This state → render → events pattern is the foundation of modern front-end frameworks.

```quiz
Q: In this app's pattern, what is the single source of truth? (one word)
A: state
Q: Which function redraws the list from state?
A: render | render()
Q: Why does each task have an id? (one word: to make it ...)
A: unique | identifiable
Q: Which property safely puts task text into the page?
A: textContent
Q: What technique uses one listener on the list for all items? (two words)
A: event delegation
Q: Which ARIA attribute shows a filter button is selected?
A: aria-pressed
```
