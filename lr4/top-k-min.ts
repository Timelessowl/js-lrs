import { exit } from "node:process";
import * as Tools from "./tools.js";

function topMin(values: number[], k: number): number[] {
  if (k === 0) return [];

  for (let root = Math.floor(values.length / 2) - 1; root >= 0; root--) {
    Tools.reorder(
      values,
      root,
      values.length,
      (first, second) => first < second,
    );
  }

  const result: number[] = [];
  for (let end = values.length - 1; end >= values.length - k; end--) {
    result.push(values[0]);
    [values[0], values[end]] = [values[end], values[0]];
    Tools.reorder(values, 0, end, (first, second) => first < second);
  }

  return result;
}

const values = [8, 3, -2, 5, 3, 0, 12];
const k = 4;
if (k <= 0 || k > values.length) {
  console.log("Wrong k somehow.....");
  exit(1);
}
console.log("Исходный массив:", values.join(", "));
console.log(`${k} наименьших элементов:`, topMin(values, k).join(", "));
