/* Marzley Learn: explains code errors in plain language, points to the line, and suggests a fix.
 * explain(lang, code, result) returns { line, title, why, fix, example, raw } or null.
 * lint(lang, code) returns friendly warnings for HTML and CSS, which never "fail" in the browser. */
(function () {
  "use strict";

  // Where each tool reports the line number in its messages
  var LINE_PATTERNS = [
    /File "<exec>", line (\d+)/g,        // Python
    /on line (\d+)/g,                    // PHP
    /<source>:(\d+):\d+/g,               // C, C++ (Compiler Explorer)
    /<source>\((\d+),\d+\)/g,            // C#
    /-->\s*<source>:(\d+):\d+/g,         // Rust
    /example\.(?:java|kt|go):(\d+)/g,    // Java, Kotlin, Go
    /\.go:(\d+):\d+/g,
    /file\.c:(\d+):\d+/g,                // C (PicoC)
    /^(\d+):(\d+)\s/gm,                  // C++ (in-browser)
    /\[string "[^"]*"\]:(\d+):/g,        // Lua
    /(?:eval|\(eval\)):(\d+)/g,          // Ruby
    /\(line (\d+)\)/g,                   // JavaScript (reported by the runner)
    /\((\d+):\d+\)/g,                    // TypeScript / JSX compile errors
    /line (\d+)/gi                        // anything else that says "line N"
  ];
  function findLine(text) {
    for (var i = 0; i < LINE_PATTERNS.length; i++) {
      var re = new RegExp(LINE_PATTERNS[i].source, LINE_PATTERNS[i].flags), m, last = null;
      while ((m = re.exec(text))) { last = m; if (!re.global) break; }
      if (last) return Number(last[1]);
    }
    return 0;
  }

  // [languages ("*" = all), pattern, title, why, fix, example]
  // In why/fix, $1, $2… are replaced with the matching parts of the error.
  var RULES = [
    // ----- stopped / too long (all) -----
    ["*", /ran for more than|took too long|was stopped|^timeout$/i, "Your code never finished",
      "A loop kept running without end, so it was stopped.", "Check the loop's condition changes each time round, e.g. i increases until the condition becomes false. Also check while (true) loops have a break.",
      "let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;   // without this, i stays 0 forever\n}"],

    // ----- Python -----
    ["python", /IndentationError: expected an indented block/i, "Missing indentation",
      "After a line ending with : (if, for, while, def, class) the next lines must be indented.", "Indent the lines inside the block by 4 spaces.",
      "if marks >= 50:\n    print(\"Pass\")   # 4 spaces"],
    ["python", /IndentationError: unexpected indent/i, "Unexpected indentation",
      "This line has spaces at the start but it isn't inside a block.", "Remove the extra spaces so it lines up with the lines around it."],
    ["python", /IndentationError|TabError/i, "Indentation doesn't line up",
      "Python uses indentation to know which lines belong together.", "Use exactly 4 spaces for each level and don't mix tabs and spaces."],
    ["python", /SyntaxError: expected ':'/i, "Missing colon",
      "Lines that start a block (if, elif, else, for, while, def, class) must end with a colon.", "Add : at the end of the line.", "for name in names:\n    print(name)"],
    ["python", /SyntaxError: (?:'\(' was never closed|unexpected EOF|EOF while parsing)/i, "A bracket was opened but not closed",
      "Python reached the end of your code while a ( [ or { was still open.", "Count your brackets on that line (and the lines above) and add the missing ) ] or }."],
    ["python", /SyntaxError: unterminated string literal/i, "A text (string) isn't closed",
      "Text in quotes must start and end with the same quote mark.", "Add the missing \" or ' at the end of the text.", "print(\"Habari\")"],
    ["python", /SyntaxError: invalid syntax\. Perhaps you forgot a comma/i, "Missing comma",
      "Items in a list, a function call or a dictionary must be separated by commas.", "Add a comma between the items.", "prices = [120, 450, 80]"],
    ["python", /SyntaxError: invalid syntax\. Maybe you meant '==' or ':=' instead of '='/i, "Use == to compare",
      "A single = stores a value; == checks whether two values are equal.", "Change = to == inside if and while conditions.", "if town == \"Nakuru\":"],
    ["python", /SyntaxError: Missing parentheses in call to 'print'/i, "print needs brackets",
      "In Python 3, print is a function.", "Write print(\"text\") with brackets."],
    ["python", /SyntaxError/i, "Syntax error",
      "Python couldn't understand this line: something is misspelt, missing or extra.", "Check the line for missing colons, brackets or quotes, and for typos in keywords (e.g. esle instead of else)."],
    ["python", /NameError: name '([^']+)' is not defined/i, "\"$1\" doesn't exist yet",
      "Python doesn't know anything called $1. It may be misspelt, used before it's created, or text that is missing quotes.", "Check the spelling (Python is case-sensitive), create $1 before using it, or put quotes around it if it's meant to be text.",
      "name = \"Amina\"\nprint(name)"],
    ["python", /TypeError: can only concatenate str \(not "(\w+)"\) to str/i, "You can't join text and a number with +",
      "You tried to add a $1 to text.", "Convert the number with str(), or use an f-string.", "print(\"Total: \" + str(total))\nprint(f\"Total: {total}\")"],
    ["python", /TypeError: unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/i, "These values can't be combined",
      "You used $1 with a $2 and a $3.", "Convert them to the same type first, e.g. int(\"5\") turns text into a number.", "age = int(input(\"Age? \"))\nprint(age + 1)"],
    ["python", /TypeError: '(\w+)' object is not callable/i, "Something isn't a function",
      "You put ( ) after a $1, as if it were a function.", "Remove the brackets, or check you didn't reuse a function's name (like list or str) as a variable."],
    ["python", /TypeError: (\w+)\(\) (?:takes|missing) .*/i, "Wrong number of values passed to $1()",
      "The function $1 was called with more or fewer values than it expects.", "Compare the call with the def line and pass exactly the values it asks for."],
    ["python", /ZeroDivisionError/i, "Division by zero",
      "You divided by 0, which has no answer.", "Check the number isn't 0 before dividing.", "if count != 0:\n    average = total / count"],
    ["python", /IndexError: (?:list|string|tuple) index out of range/i, "That position doesn't exist",
      "You asked for an item past the end. Positions start at 0, so a list of 3 items has positions 0, 1 and 2.", "Use a smaller index, check len() first, or loop with for item in items.", "items = [\"a\", \"b\", \"c\"]\nprint(items[2])   # last item\nprint(items[-1])  # also the last item"],
    ["python", /KeyError: (.+)/i, "Key $1 isn't in the dictionary",
      "The dictionary has no entry called $1.", "Check the spelling, or use .get() with a default.", "price = prices.get(\"sugar\", 0)"],
    ["python", /ValueError: invalid literal for int\(\) with base 10: '([^']*)'/i, "\"$1\" isn't a whole number",
      "int() can only convert text that contains a whole number.", "Make sure the text is a number, use float() for decimals, or check it with .isdigit() first."],
    ["python", /AttributeError: '(\w+)' object has no attribute '(\w+)'/i, "A $1 has no \"$2\"",
      "You used .$2 on a $1, which doesn't have it.", "Check the spelling and the type of the value (print(type(x)) shows it). For example, lists use .append(), text uses .upper()."],
    ["python", /ModuleNotFoundError: No module named '([^']+)'/i, "Module \"$1\" isn't available here",
      "The in-browser Python has the standard library and some common packages, but not $1.", "Check the spelling, or try the code on your own computer after pip install $1."],
    ["python", /UnboundLocalError/i, "Variable used before it was given a value",
      "Inside a function, a variable was read before being set.", "Give it a value first, or pass it into the function as a parameter."],
    ["python", /RecursionError/i, "Too many nested calls",
      "A function kept calling itself and never reached a stopping point.", "Add a base case (an if that returns without calling itself again)."],

    // ----- JavaScript / TypeScript / React / HTML scripts -----
    ["javascript typescript react html", /(\w+) is not defined/i, "\"$1\" doesn't exist",
      "JavaScript doesn't know anything called $1. It may be misspelt, used before it's declared, or text missing its quotes.", "Check the spelling (case matters), declare it with let or const first, or put quotes around text.",
      "const town = \"Kisumu\";\nconsole.log(town);"],
    ["javascript typescript react html", /Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '([^']+)'\))?/i, "Using something that is $1",
      "You tried to read .$2 from a value that is $1 (it has nothing in it).", "Check the variable was given a value, that an element with that id exists, or use ?. to read safely.", "const box = document.getElementById(\"title\");\nif (box) box.textContent = \"Hi\";\n// or: user?.name"],
    ["javascript typescript react html", /(\S+) is not a function/i, "$1 isn't a function",
      "You called $1 with ( ) but it isn't a function.", "Check the spelling (e.g. forEach, toUpperCase), and that the value is the type you expect (arrays have .map, text has .toUpperCase)."],
    ["javascript typescript react html", /Assignment to constant variable/i, "A const can't be changed",
      "You tried to change a variable declared with const.", "Use let for values that change.", "let total = 0;\ntotal = total + 5;"],
    ["javascript typescript react html", /Unexpected end of input/i, "Something isn't closed",
      "The code ended while a { ( [ or a quote was still open.", "Add the missing } ) ] or closing quote. Matching brackets are highlighted when you click next to one."],
    ["javascript typescript react html", /missing \) after argument list/i, "Missing )",
      "A function call is missing its closing bracket, or two values are missing a comma or + between them.", "Close the bracket, and join text and values with + or a template string.", "console.log(\"Total: \" + total);\nconsole.log(`Total: ${total}`);"],
    ["javascript typescript react html", /Invalid or unexpected token|Unterminated string/i, "Unclosed text or a stray character",
      "A string isn't closed, or there's a character JavaScript can't read (like a curly quote copied from Word).", "Close the string with the same quote you opened it with, and retype any “ ” quotes as \" \"."],
    ["javascript typescript react html", /Unexpected token '?([^'\s]+)'?/i, "Unexpected \"$1\"",
      "JavaScript didn't expect $1 at this point.", "Look just before it for a missing comma, bracket, or operator, or an extra one."],
    ["javascript typescript react html", /has already been declared/i, "Declared twice",
      "The same name was declared twice with let or const.", "Remove the second let/const and just assign: name = newValue."],
    ["javascript typescript react html", /Maximum call stack size exceeded/i, "A function never stops calling itself",
      "Recursion without an ending condition.", "Add a base case that returns without calling the function again."],
    ["react", /Objects are not valid as a React child/i, "Can't show an object directly",
      "React can show text and numbers, not whole objects.", "Show one field (e.g. {user.name}) or convert it: {JSON.stringify(user)}."],
    ["react", /JSX|Unterminated JSX|Expected corresponding JSX closing tag/i, "JSX tag problem",
      "Each JSX tag must be closed, and a component must return one parent element.", "Close tags like <img /> and <br />, and wrap siblings in <div> or <>…</>."],

    // ----- SQL -----
    ["sql", /no such table: (\w+)/i, "Table \"$1\" doesn't exist",
      "The sample database has Customers, Products and Orders.", "Check the spelling: table names here start with a capital letter.", "SELECT * FROM Customers;"],
    ["sql", /no such column: ([\w.]+)/i, "Column \"$1\" doesn't exist",
      "That column isn't in the table (or the table alias is wrong).", "Run SELECT * FROM TableName LIMIT 1; to see the real column names, then fix the spelling."],
    ["sql", /ambiguous column name: (\w+)/i, "\"$1\" is in more than one table",
      "When you JOIN tables, a column name that appears in both must say which table it's from.", "Write Table.$1 or alias.$1.", "SELECT c.Name, p.Name FROM Orders o JOIN Customers c ON c.CustomerID = o.CustomerID JOIN Products p ON p.ProductID = o.ProductID;"],
    ["sql", /near "([^"]+)": syntax error/i, "SQL syntax error near \"$1\"",
      "Something just before or at $1 is misspelt, missing or in the wrong order.", "Check the order SELECT … FROM … WHERE … GROUP BY … ORDER BY …, commas between columns, and quotes around text.", "SELECT Name, City FROM Customers WHERE City = 'Nairobi' ORDER BY Name;"],
    ["sql", /incomplete input/i, "The statement isn't finished",
      "SQL reached the end while expecting more (like a closing bracket or quote).", "Close any ( or ' and end the statement with ;"],

    // ----- PHP -----
    ["php", /syntax error, unexpected (?:token )?"?([^",]+)"?,? expecting[^\n]*";"/i, "Missing semicolon",
      "PHP found $1 when it expected the previous statement to end with ;", "Add ; at the end of the line before this one.", "<?php\necho \"Habari\";\necho \"Kenya\";"],
    ["php", /syntax error, unexpected end of file/i, "Something isn't closed",
      "PHP reached the end of the code while a { ( or quote was still open.", "Add the missing } ) or closing quote."],
    ["php", /syntax error, unexpected (?:token )?"?([^"\s]+)"?/i, "Unexpected \"$1\"",
      "PHP didn't expect $1 here.", "Check the line before for a missing ; ) or }, or a missing $ in front of a variable."],
    ["php", /Undefined variable \$(\w+)/i, "$$1 has no value yet",
      "The variable $$1 is used before it was given a value.", "Set it first (and check the spelling: PHP variable names are case-sensitive).", "<?php\n$total = 0;\n$total += 180;"],
    ["php", /Call to undefined function (\w+)\(\)/i, "Function $1() doesn't exist",
      "PHP has no function called $1.", "Check the spelling, or define it with function $1() { … } before calling it."],
    ["php", /Division by zero/i, "Division by zero",
      "You divided by 0.", "Check the divisor isn't 0 first: if ($count != 0) { … }"],
    ["php", /Array to string conversion/i, "Printing a whole array",
      "echo can't print an array directly.", "Use print_r($arr), implode(\", \", $arr), or loop with foreach."],
    ["php", /Undefined (?:array key|index) "?([^"]+)"?/i, "Key \"$1\" isn't in the array",
      "The array has no entry called $1.", "Check the spelling, or use $arr[\"$1\"] ?? \"default\"."],

    // ----- C and C++ -----
    ["c cpp", /expected ';'|comma expected|';' expected/i, "Missing semicolon",
      "In C and C++ every statement ends with ;", "Add ; at the end of the statement (often the line above the one reported).", "printf(\"Hello\\n\");\nint total = 0;"],
    ["c cpp", /implicit declaration of function '(\w+)'|'(\w+)' was not declared in this scope|use of undeclared identifier '(\w+)'|'(\w+)' undeclared|'(\w+)' is undefined|undeclared identifier/i, "\"$1\" isn't declared",
      "The compiler doesn't know $1. It may be misspelt, declared later, or its library isn't included.", "Check the spelling, declare variables before using them, and add the right #include (stdio.h for printf, iostream for cout, string.h for strcpy, math.h for sqrt)."],
    ["c cpp", /cannot find library: (\w+)|fatal error: ([\w.\/]+): No such file/i, "Library not available",
      "The #include file isn't available.", "Check the spelling of the #include line (e.g. <iostream>, <stdio.h>)."],
    ["c cpp", /expected '\)'|expected '\}'|expected '\]'|expected declaration or statement at end of input/i, "A bracket isn't closed",
      "A ( { or [ was opened but not closed.", "Add the missing closing bracket. Each { needs a matching }."],
    ["cpp", /no match for 'operator<<'/i, "cout can't print this value",
      "cout << doesn't know how to print that type (for example a whole array or a struct).", "Print its parts one by one, or loop over the array."],
    ["c cpp", /format '%(\w)' expects/i, "printf format doesn't match the value",
      "The %-code doesn't match the value's type.", "Use %d for int, %f for float/double, %c for char, %s for text."],
    ["c", /can't assign .* from array initializer/i, "Struct set-up isn't supported here",
      "The quick in-browser C can't fill a struct with { } at once.", "Set each field on its own line, using strcpy for text.", "struct Student s;\nstrcpy(s.name, \"Kiprop\");\ns.marks = 78;"],

    // ----- Java -----
    ["java", /cannot find symbol[\s\S]*?symbol:\s*(?:variable|method|class) (\w+)/i, "\"$1\" can't be found",
      "Java doesn't know $1: it may be misspelt, not declared, or its import is missing.", "Check the spelling (Java is case-sensitive), declare the variable with its type, or add the import (e.g. import java.util.*;)."],
    ["java", /';' expected/i, "Missing semicolon", "Java statements end with ;", "Add ; at the end of the line."],
    ["java", /incompatible types: (\S+) cannot be converted to (\S+)/i, "Wrong type: $1 isn't a $2",
      "You stored a $1 where Java expects a $2.", "Convert it (e.g. Integer.parseInt(text), String.valueOf(n)) or change the variable's type."],
    ["java", /missing return statement/i, "Missing return",
      "The method promises to return a value but some paths don't.", "Add a return at the end of the method (and in every if/else branch)."],
    ["java", /class (\w+) is public, should be declared in a file named/i, "Rename the public class",
      "The online compiler saves your code under its own file name.", "Remove the word public before class, or name the class Main without public."],
    ["java", /reached end of file while parsing/i, "Missing }", "A { was never closed.", "Add the missing } at the end."],
    ["java", /ArrayIndexOutOfBoundsException/i, "Array position doesn't exist",
      "Array positions go from 0 to length - 1.", "Loop with i < array.length (not <=)."],
    ["java", /NullPointerException/i, "Using an empty (null) value", "A variable had no object in it.", "Create the object with new before using it, or check it isn't null first."],

    // ----- C# -----
    ["csharp", /error CS1002/i, "Missing semicolon", "C# statements end with ;", "Add ; at the end of the line."],
    ["csharp", /error CS0103: The name '(\w+)' does not exist/i, "\"$1\" doesn't exist here",
      "C# doesn't know $1 in this place.", "Check the spelling, declare it (var x = …;) before using it, or add the using line for its namespace."],
    ["csharp", /error CS0029: Cannot implicitly convert type '([^']+)' to '([^']+)'/i, "Can't store a $1 in a $2",
      "The types don't match.", "Convert it (e.g. int.Parse(text), value.ToString()) or change the variable's type."],
    ["csharp", /error CS1513/i, "Missing }", "A { was never closed.", "Add the missing }."],
    ["csharp", /error CS0161/i, "Missing return", "Not every path returns a value.", "Add a return at the end of the method."],

    // ----- Go -----
    ["go", /declared and not used: (\w+)|(\w+) declared (?:and|but) not used/i, "A variable is never used",
      "Go refuses to compile unused variables.", "Use the variable, delete it, or replace its name with _ ."],
    ["go", /"([^"]+)" imported and not used/i, "Package \"$1\" is imported but unused",
      "Go refuses unused imports.", "Remove it from the import list, or use it."],
    ["go", /undefined: (\w+)/i, "\"$1\" is undefined", "Go doesn't know $1.", "Check the spelling (exported names start with a capital letter, e.g. fmt.Println) and declare it with := first."],
    ["go", /missing return/i, "Missing return", "The function must return a value on every path.", "Add a return at the end."],

    // ----- Rust -----
    ["rust", /cannot borrow `(\w+)` as mutable|cannot assign twice to immutable variable `(\w+)`/i, "Variable can't be changed",
      "Rust variables can't change unless declared with mut.", "Declare it with let mut.", "let mut total = 0;\ntotal += 5;"],
    ["rust", /mismatched types/i, "Mismatched types", "A value's type doesn't match what's expected (e.g. i32 vs f64 or &str vs String).", "Convert it (as f64, .to_string(), String::from(…)) or change the type."],
    ["rust", /cannot find value `(\w+)`/i, "\"$1\" can't be found", "Rust doesn't know $1 here.", "Check the spelling and declare it with let before using it."],
    ["rust", /expected `;`/i, "Missing semicolon", "Rust statements end with ;", "Add ; at the end of the statement."],

    // ----- Kotlin -----
    ["kotlin", /Unresolved reference:? '?(\w+)'?/i, "\"$1\" can't be found", "Kotlin doesn't know $1.", "Check the spelling and declare it with val or var first."],
    ["kotlin", /Val cannot be reassigned/i, "A val can't change", "val values are fixed.", "Use var for values that change.", "var total = 0\ntotal += 5"],
    ["kotlin", /Type mismatch|Argument type mismatch/i, "Type mismatch", "A value's type doesn't match what's expected.", "Convert it, e.g. text.toInt(), number.toString()."],
    ["kotlin", /Expecting '\)'|Expecting '\}'|Expecting an element/i, "A bracket isn't closed", "A ( or { wasn't closed.", "Add the missing ) or }."],

    // ----- Ruby -----
    ["ruby", /undefined local variable or method [`']([^']+)'/i, "\"$1\" isn't defined", "Ruby doesn't know $1.", "Check the spelling, set the variable first, or put quotes around text."],
    ["ruby", /undefined method [`']([^']+)' for (nil|an instance of \w+|[^\s]+)/i, "$2 has no method \"$1\"",
      "You called .$1 on a value that doesn't have it (often nil, meaning empty).", "Check the value isn't nil and the method name is right (e.g. .length, .upcase, .each)."],
    ["ruby", /syntax error.*(?:unexpected end-of-input|expecting 'end'|expected an `end`)/i, "Missing end", "Every def, if, do, class and while block needs an end.", "Add end to close the block."],
    ["ruby", /syntax error/i, "Syntax error", "Ruby couldn't understand this line.", "Check for missing end, quotes or brackets."],
    ["ruby", /divided by 0/i, "Division by zero", "You divided by 0.", "Check the number isn't 0 first."],
    ["ruby", /String can't be coerced into Integer|no implicit conversion of (\w+) into (\w+)/i, "Mixing text and numbers",
      "Ruby won't combine text and numbers automatically.", "Use \"Total: #{total}\" or convert with .to_s / .to_i."],

    // ----- Lua -----
    ["lua", /attempt to perform arithmetic on (?:a nil value|nil)/i, "Doing maths with an empty value",
      "A value in your calculation is nil (empty): the variable may be misspelt or never given a value.", "Give the variable a value before using it.", "local total = 0\nprint(total + 5)"],
    ["lua", /attempt to call (?:a nil value|nil)/i, "Calling a function that doesn't exist", "You called something that is nil (it doesn't exist).", "Check the spelling, and define the function before calling it."],
    ["lua", /attempt to concatenate/i, "Joining something that is empty", "One of the values you joined with .. is nil.", "Check the variable has a value, or use tostring(x)."],
    ["lua", /'end' expected/i, "Missing end", "Every if, for, while and function needs an end.", "Add end to close the block."],
    ["lua", /'=' expected|unexpected symbol/i, "Syntax error", "Lua didn't expect this here.", "Check spelling, quotes and that you used = to assign and == to compare."],

    // ----- Sass / Prolog / Regex -----
    ["sass", /Undefined variable/i, "Variable not defined", "A $variable is used before it is set (or is misspelt).", "Define it at the top, e.g. $brand: #0b1b35;"],
    ["sass", /expected "\{"|expected "\}"|expected ";"/i, "Missing bracket or semicolon", "A rule is missing { } or a declaration is missing ;", "Check each selector has { … } and each property ends with ;"],
    ["prolog", /existence_error\(procedure,\/?\(?(\w+),\s*(\d+)/i, "No rule called $1 with $2 arguments",
      "Prolog can't find $1/$2.", "Check the spelling and the number of arguments match your facts and rules."],
    ["prolog", /syntax_error/i, "Syntax error", "Prolog couldn't read a fact or rule.", "Every fact and rule must end with a full stop, and variables start with a capital letter."],
    ["regex", /Invalid pattern|Invalid regular expression/i, "The pattern isn't valid", "Brackets or special characters in the pattern don't match up.", "Escape special characters with \\ (e.g. \\. for a dot) and close every ( and [."],
    ["regex", /Write the pattern on the first line/i, "Pattern format", "The first line must be the pattern between slashes.", "Write /pattern/flags, then a line with ---, then your text.", "/\\d+/g\n---\nOrder 12 costs 450"],

    // ----- Generic fallbacks -----
    ["*", /undefined|not defined|cannot find|unknown|unresolved/i, "Something isn't defined",
      "The code uses a name the language doesn't recognise.", "Check spelling and capital letters, and make sure it is created before it is used."],
    ["*", /syntax|unexpected|expected/i, "Syntax error",
      "Something on or just before this line is missing or extra.", "Look for missing brackets, quotes, commas or semicolons."]
  ];

  function fill(s, m) { return String(s || "").replace(/\$(\d)/g, function (_, i) { return m[i] !== undefined ? m[i] : ""; }).replace(/\s+"?"\s/g, " ").replace(/""/g, "").trim(); }

  function explain(lang, code, r) {
    var raw = String((r && (r.detail || r.error)) || "");
    if (!raw || (r && r.ok)) return null;
    var hit = null;
    for (var i = 0; i < RULES.length && !hit; i++) {
      var rule = RULES[i];
      if (rule[0] !== "*" && (" " + rule[0] + " ").indexOf(" " + lang + " ") < 0) continue;
      var m = rule[1].exec(raw);
      if (m) {
        // Some patterns have alternatives; use the first group that matched
        var groups = [m[0]].concat(m.slice(1).filter(function (g) { return g !== undefined; }));
        hit = { title: fill(rule[2], groups), why: fill(rule[3], groups), fix: fill(rule[4], groups), example: rule[5] || "" };
      }
    }
    var line = findLine(raw);
    if (line && /^(javascript|typescript|react)$/.test(lang) && /\(line \d+\)/.test(raw)) line -= 1;
    var total = String(code || "").split("\n").length;
    if (line < 1 || line > total) line = 0;
    if (!hit) hit = { title: "Your code has an error", why: "Read the message below: it usually names the problem and the line.", fix: "Fix one error at a time, starting with the first one, then run again.", example: "" };
    hit.line = line;
    hit.lineText = line ? String(code).split("\n")[line - 1].trim() : "";
    hit.raw = raw;
    return hit;
  }

  // HTML and CSS never crash, so point out the most common mistakes instead
  function lint(lang, code) {
    var tips = [], src = String(code || "");
    var lineOf = function (i) { return src.slice(0, i).split("\n").length; };
    if (lang === "html" || lang === "css") {
      var VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr|!doctype)$/i, stack = [], re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*|!doctype)\b[^>]*?(\/?)>/g, m;
      var noScript = src.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, function (x) { return x.replace(/[^\n]/g, " "); });
      while ((m = re.exec(noScript))) {
        var name = m[2].toLowerCase();
        if (VOID.test(name) || m[3]) continue;
        if (!m[1]) stack.push({ name: name, at: m.index });
        else {
          var idx = -1;
          for (var k = stack.length - 1; k >= 0; k--) if (stack[k].name === name) { idx = k; break; }
          if (idx < 0) tips.push({ line: lineOf(m.index), title: "Closing tag </" + name + "> has no opening tag", fix: "Remove it, or add <" + name + "> before it." });
          else {
            stack.slice(idx + 1).forEach(function (t) { if (!/^(p|li|td|th|tr|option|html|head|body)$/.test(t.name)) tips.push({ line: lineOf(t.at), title: "<" + t.name + "> isn't closed", fix: "Add </" + t.name + "> where it should end." }); });
            stack.length = idx;
          }
        }
      }
      stack.forEach(function (t) { if (!/^(p|li|td|th|tr|option|html|head|body)$/.test(t.name)) tips.push({ line: lineOf(t.at), title: "<" + t.name + "> isn't closed", fix: "Add </" + t.name + "> where it should end." }); });
      (noScript.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) || []).slice(0, 1).forEach(function (t) { tips.push({ line: lineOf(noScript.indexOf(t)), title: "Image without alt text", fix: "Add alt=\"description\" so screen readers and Google understand the image." }); });
      // CSS inside <style> (or a whole CSS answer)
      var css = "";
      src.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, function (all, body) { css += body; return all; });
      if (!/<style/i.test(src) && lang === "css" && !/</.test(src)) css = src;
      if (css) {
        var open = (css.match(/\{/g) || []).length, close = (css.match(/\}/g) || []).length;
        if (open !== close) tips.push({ line: 0, title: open > close ? "A CSS rule is missing }" : "There's an extra } in your CSS", fix: "Every selector needs one { and one }." });
        var base = src.indexOf(css) >= 0 ? src.indexOf(css) : 0;
        var TYPO = { colour: "color", "font-colour": "color", "font-color": "color", "text-colour": "color", "text-color": "color", "background-colour": "background-color", backround: "background", "backround-color": "background-color", widht: "width", heigth: "height", "font-wieght": "font-weight", "margin-botom": "margin-bottom", "text-allign": "text-align", allign: "text-align", "boarder": "border", "boarder-radius": "border-radius" };
        var UNITLESS = /^(opacity|z-index|font-weight|line-height|flex|flex-grow|flex-shrink|order|zoom|columns|column-count|orphans|widows|tab-size)$/i;
        var dre = /([a-zA-Z-]+)\s*:\s*([^;{}]*)/g, d;
        var body = css.replace(/[^{}]*\{/g, function (x) { return x.replace(/[^\n{]/g, " "); });   // blank out selectors
        while ((d = dre.exec(body)) && tips.length < 8) {
          var prop = d[1].toLowerCase(), val = d[2], at = lineOf(base + d.index);
          if (/\n\s*[a-zA-Z-]+\s*:/.test(val)) { tips.push({ line: at, title: "Missing ; after \"" + prop + ": " + val.split("\n")[0].trim() + "\"", fix: "End each CSS declaration with a semicolon." }); continue; }
          if (TYPO[prop]) tips.push({ line: at, title: "\"" + prop + "\" isn't a CSS property", fix: "Use " + TYPO[prop] + " (CSS uses American spelling)." });
          if (/^\s*-?\d*\.?\d+\s*$/.test(val) && !/^\s*0\s*$/.test(val) && !UNITLESS.test(prop)) tips.push({ line: at, title: "\"" + prop + ": " + val.trim() + "\" needs a unit", fix: "Add a unit such as px, rem or %, e.g. " + val.trim() + "px." });
        }
      }
    }
    return tips.slice(0, 5);
  }

  window.MarzleyHelp = { explain: explain, lint: lint };
})();
