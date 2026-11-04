import { SuffixTree } from "./suffix-tree.js";

export function longestPalindrome(value: string): string {
  if (value.includes("-")) throw new Error('Input must not contain "-".');

  const characters = Array.from(value);
  const length = characters.length;
  if (length === 0) return "";

  const reversed = [...characters].reverse();
  const tree = new SuffixTree([...characters, "-", ...reversed]);
  let resultStart = 0;
  let resultLength = 1;
  for (let center = 0; center < length; center++) {
    const oddRadius = Math.min(
      tree.commonPrefixLength(center, 2 * length - center),
      center + 1,
      length - center,
    );
    const evenRadius = center === 0
      ? 0
      : Math.min(
          tree.commonPrefixLength(center, 2 * length + 1 - center),
          center,
          length - center,
        );

    if (2 * oddRadius - 1 > resultLength) {
      resultStart = center - oddRadius + 1;
      resultLength = 2 * oddRadius - 1;
    }
    if (2 * evenRadius > resultLength) {
      resultStart = center - evenRadius;
      resultLength = 2 * evenRadius;
    }
  }
  return characters.slice(resultStart, resultStart + resultLength).join("");
}
