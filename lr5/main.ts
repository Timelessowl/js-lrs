import { Dictionary } from "./dictionary.js";

const dictionary = new Dictionary();
dictionary.addWords(["cat", "js", "lab"]);
dictionary.addWord("cats");

console.log(`Contains "cat": ${dictionary.hasWord("cat")}`);
console.log(`Contains "dog": ${dictionary.hasWord("dog")}`);
