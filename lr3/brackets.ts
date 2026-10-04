import { createInterface } from "node:readline/promises";

const PAIRS: Record<string, string> = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
};
const OPENING_BRACKETS = "([{<";

function isBalanced(input: string): boolean {
  const stack: string[] = [];

  for (const character of input) {
    if (OPENING_BRACKETS.includes(character)) {
      stack.push(character);
    } else if (
      PAIRS[character] !== undefined &&
      stack.pop() !== PAIRS[character]
    ) {
      return false;
    }
  }

  return stack.length === 0;
}

const defaultInput = "({[<>]})";
let input = "";

const rl = createInterface({ input: process.stdin, output: process.stdout });
try {
  input = await rl.question("Введите строку со скобками: ");
} finally {
  rl.close();
}

const val = input.trim() || defaultInput;
console.log("Строка:", JSON.stringify(val));
console.log(
  isBalanced(val) ? "Скобки сбалансированы." : "Скобки не сбалансированы.",
);
