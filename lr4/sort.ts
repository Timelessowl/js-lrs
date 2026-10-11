function reorder(values: number[], root: number, heapSize: number): void {
  let i = root;
  let left = 2 * i + 1;
  while (left < heapSize) {
    const right = left + 1;
    let largest = left;
    if (right < heapSize && values[right] > values[left]) largest = right;
    if (values[i] >= values[largest]) return;

    [values[i], values[largest]] = [values[largest], values[i]];
    i = largest;
    left = 2 * i + 1;
  }
}

function heapSort(values: number[]): number[] {
  for (let root = Math.floor(values.length / 2) - 1; root >= 0; root--) {
    reorder(values, root, values.length);
  }

  for (let end = values.length - 1; end > 0; end--) {
    [values[0], values[end]] = [values[end], values[0]];
    reorder(values, 0, end);
  }

  return values;
}

const sortValues = [8, 3, -2, 5, 3, 0, 12];
console.log("Исходный массив:", sortValues.join(", "));
console.log("Отсортированный массив:", heapSort(sortValues).join(", "));
