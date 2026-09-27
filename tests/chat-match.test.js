// Checks the website chat picks the right knowledge-base answer for common questions.
// Run: node tests/chat-match.test.js  (also run by tests/run.sh)
"use strict";
const fs = require("fs");
const root = __dirname + "/..";
const src = fs.readFileSync(root + "/js/home.js", "utf8");
const code = src.slice(src.indexOf("    var SYN = [["), src.indexOf("    var SMALL = ["));
const KB = JSON.parse(fs.readFileSync(root + "/data/knowledge.json", "utf8")).entries;
const { match } = new Function("KB", code + ";return {match};")(KB);

const CASES = {
  "how much is a website": "prices", "bei ya tovuti ni ngapi": "prices", "website prices in kenya": "prices",
  "I need an online shop for my clothes business": "ecommerce", "I want to sell online": "ecommerce",
  "can you add mpesa to my site": "mpesa", "lipa na mpesa on my website": "mpesa", "do I need a paybill": "paybill",
  "can you connect paystack": "cards", "how long will my website take": "timeline", "do you do hosting and domain": "hosting",
  "I want a school management system": "school", "hospital system price": "hospital", "pharmacy system": "hospital",
  "do you train web development": "webdev-course", "what are your course fees": "course-fees", "nataka kujifunza programming": "programming-course",
  "can I get a certificate": "certificate", "my website was hacked help": "hacked", "where are you located": "location",
  "are you open on sunday": "hours", "how do I pay you": "payment-terms", "can I pay in installments": "payment-terms", "nikulipe aje": "payment-terms",
  "do I own the website after": "ownership", "can you make a logo": "design", "do you build android apps": "app", "mnatengeneza app": "app",
  "what is cbet planner": "cbet", "how do I track my project": "portal", "I already paid my invoice": "invoices",
  "refer a friend reward": "referral", "talk to a real person": "human", "how can i rank on google": "seo", "do you do SEO": "seo",
  "is it safe to pay you": "payment-safety", "do you have discounts": "affordable", "church website": "ngo", "wifi billing system": "wifi",
  "what technologies do you use": "tech", "can I edit my website myself": "self-edit", "what's included in the business care plan": "care",
  "monthly maintenance": "care", "do you redesign old websites": "redesign", "who is kelvin": "about", "show me your past work": "portfolio",
  "nipigie simu": "contact", "what is your email": "contact", "check my website speed": "site-check", "book a meeting": "booking",
  "is my website mobile friendly": "mobile", "privacy policy": "privacy", "refund policy": "terms", "google maps listing": "google-maps",
  "do i need a website or just facebook": "facebook", "business email for my domain": "email", "how do you work": "process",
};
let fail = 0;
for (const [q, want] of Object.entries(CASES)) {
  const got = (match(q)[0] || { e: { id: "(none)" } }).e.id;
  if (got !== want) { fail++; console.log(`FAIL chat: "${q}" → ${got} (expected ${want})`); }
}
console.log(fail ? `${fail} of ${Object.keys(CASES).length} chat questions answered wrongly` : `PASS chat matcher: all ${Object.keys(CASES).length} questions answered from the right topic`);
process.exit(fail ? 1 : 0);
