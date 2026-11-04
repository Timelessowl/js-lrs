import type { TreeNode } from "./tree.js";

export function inorder<T>(root: TreeNode<T> | null): T[] {
  if (!root) return [];

  const stack = [{ node: root, visited: false }];
  const result: T[] = [];
  while (stack.length > 0) {
    const { node, visited } = stack.pop()!;
    if (visited) {
      result.push(node.value);
      continue;
    }

    for (let index = node.children.length - 1; index >= 1; index--) {
      stack.push({ node: node.children[index], visited: false });
    }
    stack.push({ node, visited: true });
    if (node.children.length > 0) {
      stack.push({ node: node.children[0], visited: false });
    }
  }
  return result;
}
