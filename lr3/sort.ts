function mergeSort(values: number[]): number[] {
  if (values.length <= 1) return [...values];

  const middle = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, middle));
  const right = mergeSort(values.slice(middle));

  const result: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    result.push(
      left[leftIndex] <= right[rightIndex]
        ? left[leftIndex++]
        : right[rightIndex++],
    );
  }

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

const sortValues = [8, 3, -2, 5, 3, 0, 12];
console.log("Исходный массив:", sortValues);
console.log("Отсортированный массив:", mergeSort(sortValues));
