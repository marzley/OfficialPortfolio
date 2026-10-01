---
slug: rag-and-agents
title: "Level 5: Chat with your documents (RAG), tools and AI agents"
after: build-with-ai-apis
---
# Level 5: Chat with your documents (RAG), tools and AI agents

Two ideas turn a general chatbot into a genuinely useful business system: **retrieval-augmented generation (RAG)**, which lets AI answer from **your** documents, and **tools/agents**, which let AI **take actions** like checking an order or booking an appointment.

## RAG: answers grounded in your documents

A general model doesn't know your school's fee structure, your SACCO's loan policy or your clinic's opening hours, and it may hallucinate if asked. RAG fixes that:

1. **Split** your documents into small chunks (paragraphs).
2. **Index** them: usually by turning each chunk into an **embedding** (numbers that represent meaning).
3. When a question comes in, **retrieve** the most relevant chunks.
4. **Send** the question **plus those chunks** to the AI with the instruction "answer using only this information".
5. The AI answers, ideally **citing** which document it used.

### A mini RAG system you can run

This version uses simple word overlap instead of real embeddings, so it runs anywhere, but the steps are exactly the ones real systems use.

```try-python
import math
import re
from collections import Counter

documents = {
    "fees": "School fees are KSh 18,000 per term, payable by M-Pesa Paybill 400200, account: student number.",
    "intake": "We admit new students in January, May and September. Applications close two weeks before each intake.",
    "transport": "School buses serve Thika town, Ruiru and Juja. Transport costs KSh 6,000 per term.",
    "uniform": "Uniforms are sold at the school shop. A full set costs KSh 4,500.",
}

STOP = {"the", "a", "is", "are", "and", "of", "per", "do", "you", "what", "how", "much", "in", "to", "we", "by"}

def tokens(text):
    return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOP]

def similarity(q, d):
    qa, da = Counter(tokens(q)), Counter(tokens(d))
    dot = sum(qa[w] * da[w] for w in qa)
    norm = math.sqrt(sum(v * v for v in qa.values())) * math.sqrt(sum(v * v for v in da.values()))
    return dot / norm if norm else 0.0

def retrieve(question, k=2):
    ranked = sorted(documents.items(), key=lambda kv: similarity(question, kv[1]), reverse=True)
    return [(name, text) for name, text in ranked[:k] if similarity(question, text) > 0]

def build_prompt(question):
    chunks = retrieve(question)
    context = "\n".join(f"[{name}] {text}" for name, text in chunks) or "(no relevant documents found)"
    return ("Answer the parent's question using ONLY the information below. "
            "If the answer is not there, say you are not sure.\n\n"
            f"Information:\n{context}\n\nQuestion: {question}")

print(build_prompt("How much is transport per term?"))
print("=" * 50)
print(build_prompt("When is the next intake?"))
```

In production, the final prompt is sent to an AI API (previous lesson), and the retrieval step uses real embeddings stored in a **vector database** (for example pgvector in PostgreSQL, or a hosted vector store).

### Why RAG beats "just ask the AI"

| Without RAG | With RAG |
|---|---|
| May invent fees and dates | Answers from your real documents |
| Doesn't know your latest updates | Update the documents and answers change instantly |
| Can't show where an answer came from | Can cite the source document |

## Tools: letting AI take actions

Modern AI APIs support **tool use** (also called function calling): you describe functions your system has (for example `check_order_status(order_id)` or `book_appointment(date, time)`), and the model can **ask** your code to run them. Your code runs the function and sends the result back; the model then writes the reply.

```
User: "Has order 1042 been delivered?"
AI → asks to call: check_order_status(order_id="1042")
Your code → looks it up in your database → "Out for delivery, rider: Otieno, ETA 3pm"
AI → "Your order 1042 is on its way with Otieno and should arrive around 3 pm."
```

The model never touches your database directly: **your code decides what each tool is allowed to do.**

This simulation shows the loop, with a pretend "AI" choosing the tool from keywords:

```try-python
import re

orders = {"1042": "Out for delivery, rider Otieno, arriving about 3pm", "1043": "Delivered yesterday"}

def check_order_status(order_id):
    return orders.get(order_id, "No order with that number")

TOOLS = {"check_order_status": check_order_status}

def pretend_model(user_message):
    # A real model decides this itself from the tool descriptions you give it
    m = re.search(r"\border (\d+)", user_message.lower())
    if m:
        return {"tool": "check_order_status", "args": {"order_id": m.group(1)}}
    return {"reply": "Please share your order number."}

def handle(user_message):
    decision = pretend_model(user_message)
    if "tool" in decision:
        result = TOOLS[decision["tool"]](**decision["args"])       # your code runs the tool
        return f"(tool said: {result}) -> AI writes a friendly reply from this"
    return decision["reply"]

for msg in ["Has order 1042 been delivered?", "Where is my parcel?", "Status of order 9999"]:
    print(msg, "\n  ", handle(msg))
```

## Agents: AI that works in steps

An **agent** is an AI given a goal, some tools and the ability to **loop**: think, use a tool, look at the result, decide the next step, until the job is done. Examples: a coding agent that reads files, edits code and runs tests; a research agent that searches, reads and writes a report.

Agents are powerful but need care:

| Good practice | Why |
|---|---|
| Give only the tools the task needs | Limits the damage of mistakes |
| Require human approval for risky actions (payments, deleting, sending emails) | Keeps people in control |
| Set limits on steps, time and cost | Stops runaway loops |
| Log every step | So you can review what happened |
| Start with a simple workflow; use an agent only when the task is open-ended | Simpler systems are cheaper and more reliable |

## Evaluating AI systems

Professionals don't guess whether an AI feature works: they build an **evaluation set** of real questions with expected answers, run the system on it after every change, and track the score. For a school assistant: 50 real parent questions, checked for correct facts, polite tone and saying "not sure" when appropriate.

```quiz
Q: What does RAG stand for?
A: retrieval-augmented generation | retrieval augmented generation
Q: In RAG, what step finds the most relevant document chunks?
A: retrieval | retrieve
Q: What kind of database stores embeddings for fast similarity search?
A: a vector database | vector database | vector store
Q: When AI asks your code to run a function, it's called tool use or function ...?
A: calling
Q: Should an agent send payments without human approval? (yes or no)
A: no
Q: A set of real questions with expected answers used to test an AI system is called an ...?
A: evaluation set | eval | evaluation | eval set
```
