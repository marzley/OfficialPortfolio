// Runs C (PicoC) or C++ (JSCPP) code with the same in-browser engines the learning hub uses,
// so tools/learn_check.py can confirm lesson examples work for learners, not just with gcc.
// Usage: node tools/learn_engine_run.js c|cpp < code
const path = require("path");
const lang = process.argv[2];
const code = require("fs").readFileSync(0, "utf8");
const langs = path.join(__dirname, "..", "vendor", "langs");
let out = "";

(async () => {
  if (lang === "c") {
    const picoc = require(path.join(langs, "picoc.js"));
    await Promise.resolve(picoc.runC(code, (s) => { out += String(s) + "\n"; }));
    process.stdout.write(out);
    if (/file\.c:\d+:\d+/.test(out)) process.exit(1);   // PicoC prints its errors as output
  } else if (lang === "cpp") {
    global.window = global; global.self = global;
    const JSCPP = require(path.join(langs, "jscpp.js"));
    const run = (...a) => global.JSCPP.run(...a);
    const exit = run(code, "", { stdio: { write: (s) => { out += s; } }, unsigned_overflow: "ignore" });
    process.stdout.write(out);
    if (exit) process.exit(1);
  }
})().catch((e) => { process.stdout.write(out); console.error(String(e && e.message || e)); process.exit(1); });
