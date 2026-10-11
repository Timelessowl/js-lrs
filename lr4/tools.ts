export function reorder<T>(
  values: T[],
  root: number,
  heapSize: number,
  predicate: (first: T, second: T) => boolean,
): void {
  let i = root;
  let left = 2 * i + 1;
  while (left < heapSize) {
    const right = left + 1;
    let selected = left;
    if (right < heapSize && predicate(values[right], values[left]))
      selected = right;
    if (!predicate(values[selected], values[i])) return;

    [values[i], values[selected]] = [values[selected], values[i]];
    i = selected;
    left = 2 * i + 1;
  }
}

export function reorderDown<T>(
  values: T[],
  root: number,
  heapSize: number,
  predicate: (first: T, second: T) => boolean,
): void {
  reorder(values, root, heapSize, predicate);
}

export function reorderUp<T>(
  values: T[],
  index: number,
  predicate: (first: T, second: T) => boolean,
): void {
  let i = index;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (!predicate(values[i], values[parent])) return;

    [values[i], values[parent]] = [values[parent], values[i]];
    i = parent;
  }
}
