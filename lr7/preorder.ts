import type { TreeNode } from "./tree.js";

export function preorder<T>(root: TreeNode<T> | null): T[] {
  if (!root) return [];

  const stack = [root];
  const result: T[] = [];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.value);
    for (let index = node.children.length - 1; index >= 0; index--) {
      stack.push(node.children[index]);
    }
  }
  return result;
}
