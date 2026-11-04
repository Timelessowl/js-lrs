import type { TreeNode } from "./tree.js";

export function bfs<T>(root: TreeNode<T> | null): T[] {
  if (!root) return [];

  const queue = [root];
  const result: T[] = [];
  for (let index = 0; index < queue.length; index++) {
    const node = queue[index];
    result.push(node.value);
    for (const child of node.children) {
      queue.push(child);
    }
  }
  return result;
}
