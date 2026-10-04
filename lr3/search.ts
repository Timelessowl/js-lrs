function binarySearch(values: number[], target: number): number {
  let left = 0;
  let right = values.length - 1;

  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);
    if (values[middle] === target) return middle;
    if (values[middle] < target) left = middle + 1;
    else right = middle - 1;
  }

  return -1;
}

const searchValues = [-2, 0, 3, 3, 5, 8, 12];
const target = 5;

console.log("Индекс:", binarySearch(searchValues, target));
