import { SuffixTree } from "./suffix-tree.js";
import { longestPalindrome } from "./palindrome.js";

const treeValue = "magazine";
const tree = new SuffixTree(treeValue);
const palindromeValue = "telegram";

console.log("Строка для суффиксного дерева:", treeValue);
console.log(`Contains "gaz": ${tree.hasSubstring("gaz")}`);
console.log(`Contains "cat": ${tree.hasSubstring("cat")}`);
console.log("Строка для поиска палиндрома:", palindromeValue);
console.log("Самый длинный палиндром:", longestPalindrome(palindromeValue));
