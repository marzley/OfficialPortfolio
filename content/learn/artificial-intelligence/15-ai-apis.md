---
slug: build-with-ai-apis
title: "Level 5: Building apps with AI APIs"
after: how-llms-work
---
# Level 5: Building apps with AI APIs

So far you've used AI through chat apps. Professionals build AI **into their own products**: a school website that answers parents' questions, a hospital system that summarises patient notes, a shop that writes product descriptions automatically. They do it through an **API** (application programming interface): your program sends text to the AI provider's servers and gets the answer back.

> New to APIs? Read **APIs & backends** concepts in the JavaScript and PHP subjects first. You need basic Python, JavaScript or PHP for this lesson.

## How an AI API call works

```
Your app (website / mobile app)
      │  1. user asks a question
      ▼
Your server (PHP, Python, Node)  ── holds the SECRET API key
      │  2. sends: model name, instructions, the user's message
      ▼
AI provider (for example Anthropic's Claude API)
      │  3. returns the AI's reply (and token usage for billing)
      ▼
Your server → your app shows the answer
```

**The golden security rule:** the **API key stays on your server**, never in the website's JavaScript or inside a mobile app. Anyone can read code that runs on a phone or in a browser, and a stolen key lets strangers run up your bill. It's the same rule as M-Pesa Daraja keys.

## Getting set up (Claude API example)

1. Create an account at the Claude developer console (**console.anthropic.com**), add billing, and create an **API key**.
2. Store the key as an **environment variable** (never paste it into code you share or commit to GitHub):

```bash
export ANTHROPIC_API_KEY="your-key-here"     # Linux / macOS (on Windows: setx ANTHROPIC_API_KEY "...")
```

3. Install the official library for your language.

## Your first call: Python

```bash
pip install anthropic
```

```python
import anthropic

client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY from the environment

message = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    system="You are a friendly assistant for a Kenyan online shop. Answer briefly, in simple English.",
    messages=[
        {"role": "user", "content": "Write a 50-word description for a solar lantern that also charges phones."}
    ],
)

for block in message.content:           # the reply is a list of content blocks
    if block.type == "text":
        print(block.text)

print("Tokens used:", message.usage.input_tokens, "in,", message.usage.output_tokens, "out")
```

What each part means:

| Part | Meaning |
|---|---|
| `model` | Which AI model to use |
| `max_tokens` | The longest reply allowed (in tokens) |
| `system` | Instructions that shape every reply: role, tone, rules |
| `messages` | The conversation: `user` messages, and earlier `assistant` replies for multi-turn chat |
| `usage` | Tokens in and out: this is what you pay for |

## The same call with curl (any language can do this)

Under the hood, it's a normal HTTPS request with JSON:

```bash
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 16000,
    "messages": [
      {"role": "user", "content": "Explain M-Pesa to a tourist in 3 sentences."}
    ]
  }'
```

## On a PHP website (common for Kenyan hosting)

Most Kenyan business sites run on PHP with cPanel hosting. Install the official SDK with Composer (`composer require anthropic-ai/sdk`), then on your server:

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use Anthropic\Client;

$client = new Client(apiKey: getenv('ANTHROPIC_API_KEY'));   // key from the server environment, never from the browser

$question = trim($_POST['question'] ?? '');
if ($question === '' || mb_strlen($question) > 1000) {
    http_response_code(400);
    exit(json_encode(['error' => 'Please ask a short question.']));
}

$message = $client->messages->create(
    model: 'claude-opus-5-5',
    maxTokens: 16000,
    system: 'You answer questions about Green Valley School admissions. Use only these facts: '
          . 'Fees: KSh 18,000 per term. Intake: January, May, September. Phone: 0700 000 000. '
          . 'If the answer is not in the facts, say you are not sure and give the phone number.',
    messages: [['role' => 'user', 'content' => $question]],
);

$answer = '';
foreach ($message->content as $block) {
    if ($block->type === 'text') {
        $answer .= $block->text;
    }
}
header('Content-Type: application/json');
echo json_encode(['answer' => $answer]);
```

The website's JavaScript sends the question to **this PHP file**, not to the AI provider, so the key stays hidden.

## Multi-turn conversations

The API doesn't remember previous calls. To continue a chat, send the whole conversation each time:

```python
messages = [
    {"role": "user", "content": "What is a SACCO?"},
    {"role": "assistant", "content": "A SACCO is a member-owned savings and credit cooperative..."},
    {"role": "user", "content": "How is it different from a bank?"},
]
```

## Costs: thinking in tokens

You pay per **million tokens** of input and output (output costs more). Prices differ by model and change over time: check the provider's pricing page. To keep costs down:

- Keep instructions and context **only as long as needed**.
- Set sensible **limits** on how many questions each user can ask.
- **Cache** answers to common questions.
- Measure real usage (the `usage` field) before launching widely.

## Building responsibly

- **Validate input** (length, type) and **limit requests** per user to stop abuse.
- **Ground answers in your facts** ("use only these facts") to reduce hallucinations.
- **Tell users** they're talking to an AI, and offer a human contact.
- **Protect personal data** (Kenya's Data Protection Act): don't send more personal information than needed, and explain it in your privacy policy.
- **Log errors** and handle failures gracefully ("Sorry, try again in a minute").
- **Test with real questions**, including tricky and rude ones, before launch.

```quiz
Q: Where must the AI API key be kept?
A: on the server | server | on your server
Q: Which request part sets the AI's role, tone and rules for every reply?
A: system | the system prompt | system prompt
Q: Does the API remember previous calls by itself? (yes or no)
A: no
Q: What unit do AI APIs charge by?
A: tokens | per token | million tokens
Q: Which HTTP header carries the Claude API key in the curl example?
A: x-api-key
Q: Name one way to reduce AI API costs.
A: caching | cache | shorter prompts | limits | rate limits | cache answers
```
