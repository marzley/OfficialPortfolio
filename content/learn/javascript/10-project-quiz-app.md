---
slug: project-quiz-app
title: Project: a quiz app with score and timer
---
# Project: a quiz app with score and timer

Let's build a complete, working quiz app: questions from an array of objects, multiple-choice buttons, instant feedback, a countdown timer, a final score and a saved high score. It uses almost everything from this tutorial.

## How it's organised

1. **Data**: an array of question objects.
2. **State**: which question we're on, the score, the time left.
3. **Render**: a function that draws the current question.
4. **Events**: clicking an answer checks it and moves on.
5. **Storage**: the best score saved in `localStorage`.

## The app

```try-html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: system-ui, sans-serif; background: #0b1b35; color: #fff; display: grid; place-items: center; min-height: 100vh; margin: 0; }
  .quiz { background: #fff; color: #0b1b35; width: min(92vw, 440px); border-radius: 18px; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
  .top { display: flex; justify-content: space-between; font-size: 14px; color: #64748b; }
  .bar { height: 6px; background: #e2e8f0; border-radius: 6px; margin: 10px 0 16px; overflow: hidden; }
  .bar span { display: block; height: 100%; background: #ffb800; transition: width .3s; }
  h2 { font-size: 1.2rem; margin: 0 0 14px; }
  .choices { display: grid; gap: 8px; }
  .choices button { text-align: left; padding: 12px 14px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; font-size: 1rem; cursor: pointer; }
  .choices button:hover:not(:disabled) { border-color: #0b1b35; }
  .choices .right { border-color: #16a34a; background: #dcfce7; }
  .choices .wrong { border-color: #dc2626; background: #fee2e2; }
  .next, .again { margin-top: 14px; padding: 10px 16px; border: 0; border-radius: 10px; background: #0b1b35; color: #fff; font-weight: 700; cursor: pointer; }
  .timer.low { color: #dc2626; font-weight: 700; }
</style>
</head>
<body>
<div class="quiz" id="quiz"></div>
<script>
  const questions = [
    { q: "What does HTML stand for?", choices: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language"], answer: 0 },
    { q: "Which CSS property changes text colour?", choices: ["font-color", "color", "text-colour"], answer: 1 },
    { q: "Which keyword declares a value that won't be reassigned?", choices: ["let", "var", "const"], answer: 2 },
    { q: "What is the capital city of Kenya?", choices: ["Mombasa", "Nairobi", "Kisumu"], answer: 1 },
    { q: "Which array method keeps only matching items?", choices: ["map", "filter", "reduce"], answer: 1 },
  ];

  const state = { index: 0, score: 0, timeLeft: 15, timerId: null };
  const box = document.getElementById("quiz");
  let best = 0;
  try { best = Number(localStorage.getItem("quiz-best")) || 0; } catch (e) {}

  function render() {
    const item = questions[state.index];
    const progress = Math.round((state.index / questions.length) * 100);
    box.innerHTML = `
      <div class="top"><span>Question ${state.index + 1} of ${questions.length}</span>
        <span class="timer" id="timer">⏱ ${state.timeLeft}s</span></div>
      <div class="bar"><span style="width:${progress}%"></span></div>
      <h2>${item.q}</h2>
      <div class="choices">${item.choices.map((c, i) => `<button data-i="${i}">${c}</button>`).join("")}</div>`;
    box.querySelectorAll(".choices button").forEach((btn) =>
      btn.addEventListener("click", () => choose(Number(btn.dataset.i))));
    startTimer();
  }

  function startTimer() {
    clearInterval(state.timerId);
    state.timeLeft = 15;
    state.timerId = setInterval(() => {
      state.timeLeft--;
      const t = document.getElementById("timer");
      t.textContent = `⏱ ${state.timeLeft}s`;
      t.classList.toggle("low", state.timeLeft <= 5);
      if (state.timeLeft <= 0) choose(-1);     // time's up counts as wrong
    }, 1000);
  }

  function choose(i) {
    clearInterval(state.timerId);
    const item = questions[state.index];
    const buttons = box.querySelectorAll(".choices button");
    buttons.forEach((b, n) => {
      b.disabled = true;
      if (n === item.answer) b.classList.add("right");
      else if (n === i) b.classList.add("wrong");
    });
    if (i === item.answer) state.score++;
    const next = document.createElement("button");
    next.className = "next";
    next.textContent = state.index + 1 < questions.length ? "Next →" : "See my score";
    next.addEventListener("click", () => {
      state.index++;
      state.index < questions.length ? render() : finish();
    });
    box.appendChild(next);
  }

  function finish() {
    best = Math.max(best, state.score);
    try { localStorage.setItem("quiz-best", best); } catch (e) {}
    const percent = Math.round((state.score / questions.length) * 100);
    box.innerHTML = `<h2>You scored ${state.score} of ${questions.length} (${percent}%)</h2>
      <p>${percent >= 80 ? "Excellent! 🎉" : percent >= 50 ? "Good work, keep practising." : "Keep going, you'll get there!"}</p>
      <p>Best score: ${best}</p>
      <button class="again">Play again</button>`;
    box.querySelector(".again").addEventListener("click", () => {
      Object.assign(state, { index: 0, score: 0 });
      render();
    });
  }

  render();
</script>
</body>
</html>
```

## Walk through the key ideas

| Idea | Where in the code |
|---|---|
| Array of objects as data | `questions` |
| State object | `state` holds index, score and timer |
| Template literals to build HTML | `render()` |
| `map` + `join` to make buttons | `item.choices.map(...)` |
| Events and `data-` attributes | `btn.dataset.i` |
| Timers | `setInterval` / `clearInterval` |
| Saving data | `localStorage` with `try/catch` |
| Ternary operators | messages and button text |

## Challenges

1. Add 5 more questions about Kenya or your own course.
2. Shuffle the questions each game: `questions.sort(() => Math.random() - 0.5)`.
3. Give 2 points for answers in under 5 seconds.
4. Load the questions from a JSON file with `fetch`.
5. Add a "Review answers" screen at the end showing what the player chose.

## How real quiz and exam apps work

Platforms for school revision, driving theory tests, job aptitude tests and online courses (including the quizzes on this site) all follow the same pattern you just built: a list of questions as **data**, a **state** object tracking progress, a **render** function that draws the current state, and **event handlers** that update the state and render again. This "state → render" loop is the core idea behind React, Vue and most modern front-end frameworks, so this project prepares you for them.

| Part | In this app | In bigger apps |
|---|---|---|
| Data | `questions` array | Loaded from an API or database |
| State | `state` object | Framework state (useState, stores) |
| View | `render()` builds HTML | Components |
| Events | Button clicks | Same, plus routing and forms |
| Persistence | `localStorage` best score | Server database, user accounts |

## Step-by-step: building it yourself

1. **Write the data first**: an array of `{ q, choices, answer }` objects. Test that you can `console.log` each question.
2. **Create the state**: `{ index: 0, score: 0 }`. Every screen should be drawable from state alone.
3. **Render one question**: build the HTML for `questions[state.index]`.
4. **Handle a click**: compare the chosen index with `answer`, update the score, show right/wrong colours, disable buttons.
5. **Next question**: increase `index`, render again; when `index === questions.length`, show the results screen.
6. **Add the timer**: `setInterval` every second, `clearInterval` when answered or time runs out.
7. **Save the best score** with `localStorage` inside `try/catch` (it can fail in private mode).
8. **Polish**: progress bar, keyboard support, shuffling, accessibility.

Building in small steps and testing after each one is how professionals avoid getting lost.

## The quiz logic without the DOM

Separating logic from display lets you test it in Node. Here is the core as pure functions:

```try-javascript
function createQuiz(questions) {
  return { questions, index: 0, score: 0, answers: [] };
}
function answer(quiz, choice) {
  const q = quiz.questions[quiz.index];
  const correct = choice === q.answer;
  return {
    ...quiz,
    score: quiz.score + (correct ? 1 : 0),
    answers: [...quiz.answers, { q: q.q, choice, correct }],
    index: quiz.index + 1,
  };
}
const isFinished = quiz => quiz.index >= quiz.questions.length;
function summary(quiz) {
  const pct = Math.round((quiz.score / quiz.questions.length) * 100);
  const grade = pct >= 80 ? "Excellent" : pct >= 50 ? "Good, keep practising" : "Revise and try again";
  return `${quiz.score}/${quiz.questions.length} (${pct}%) - ${grade}`;
}

let quiz = createQuiz([
  { q: "2 + 2?", choices: ["3", "4"], answer: 1 },
  { q: "Capital of Kenya?", choices: ["Nairobi", "Nakuru"], answer: 0 },
  { q: "CSS stands for?", choices: ["Cascading Style Sheets", "Computer Style System"], answer: 0 },
]);
for (const pick of [1, 1, 0]) quiz = answer(quiz, pick);
console.log(isFinished(quiz), summary(quiz));
quiz.answers.filter(a => !a.correct).forEach(a => console.log("Review:", a.q));
```

Because `answer` returns a new object instead of changing the old one, you could even add an "undo" button by keeping the previous states.

## Shuffling questions and answers fairly

The common shortcut `arr.sort(() => Math.random() - 0.5)` gives biased results. Use the **Fisher–Yates shuffle**:

```try-javascript
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleChoices(q) {
  const order = shuffle(q.choices.map((_, i) => i));
  return { ...q, choices: order.map(i => q.choices[i]), answer: order.indexOf(q.answer) };
}

const q = { q: "Which tag makes a link?", choices: ["<a>", "<p>", "<img>", "<div>"], answer: 0 };
const s = shuffleChoices(q);
console.log(s.choices, "correct:", s.choices[s.answer]);
```

When you shuffle choices, the index of the correct answer moves, so it must be recalculated, as `shuffleChoices` does.

## Loading questions from JSON

In real apps, questions live in a file or database so teachers can edit them without touching code:

```javascript
async function loadQuestions() {
  try {
    const res = await fetch("questions.json");
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    box.textContent = "Couldn't load questions. Check your connection and refresh.";
    return [];
  }
}
loadQuestions().then(qs => { questions = shuffle(qs).slice(0, 10); render(); });
```

Picking 10 random questions from a bank of 100 gives a different test each time.

## Keyboard and accessibility improvements

```javascript
document.addEventListener("keydown", e => {
  const n = Number(e.key);                        // keys 1, 2, 3...
  const buttons = box.querySelectorAll(".choices button:not(:disabled)");
  if (n >= 1 && n <= buttons.length) buttons[n - 1].click();
  if (e.key === "Enter") box.querySelector(".next")?.click();
});
```

- Use real `<button>` elements so they work with Tab and Enter.
- Don't rely on colour alone: add "✓ Correct" / "✗ Wrong" text for colour-blind users.
- Announce results with an `aria-live="polite"` region.
- Respect `prefers-reduced-motion` for animations.

## Preventing cheating (and its limits)

Everything in front-end JavaScript, including the answers array, can be seen in DevTools. For practice quizzes that's fine. For exams or certificates:

- Keep answers on the **server**; the browser sends the chosen option and the server marks it.
- Time limits must be checked on the server too (record the start time server-side).
- Randomise question order and choices per student.

## Ideas to extend the project

1. Categories (HTML, CSS, JavaScript) chosen on a start screen.
2. A review screen showing each question, your answer and the correct one.
3. Different points for faster answers (time bonus).
4. A leaderboard stored in localStorage (top 5 names and scores).
5. Kiswahili and English versions of questions.
6. Turn it into a PWA so it works offline on phones.

:::think Why is `array.sort(() => Math.random() - 0.5)` a poor way to shuffle quiz questions?
Sorting algorithms assume the comparison is consistent; random answers make some orders far more likely than others, so the shuffle is biased (and results depend on the browser's sort algorithm). Fisher–Yates swaps each position with a random earlier one, giving every order an equal chance in a single pass.
:::

```quiz
Q: Which function repeats code every second in the timer?
A: setInterval | setInterval()
Q: Which function stops the timer?
A: clearInterval | clearInterval()
Q: Where is the best score saved so it survives a page reload?
A: localStorage | local storage
Q: Which attribute stores the choice number on each button? (the data- name)
A: data-i | i
Q: What is the name of the fair shuffling algorithm? (hyphenated names)
A: Fisher-Yates | Fisher Yates | Fisher–Yates | Knuth shuffle
Q: For a graded exam, where should the correct answers be kept: browser or server?
A: server | the server
Q: Which pattern describes drawing the screen from a state object after every change? (two words, arrow optional)
A: state render | state -> render | state to render
```
