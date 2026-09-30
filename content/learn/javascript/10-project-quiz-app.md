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

```quiz
Q: Which function repeats code every second in the timer?
A: setInterval | setInterval()
Q: Which function stops the timer?
A: clearInterval | clearInterval()
Q: Where is the best score saved so it survives a page reload?
A: localStorage | local storage
Q: Which attribute stores the choice number on each button? (the data- name)
A: data-i | i
```
