import type { TreeNode } from "./tree.js";

export function postorder<T>(root: TreeNode<T> | null): T[] {
  if (!root) return [];

  const stack = [{ node: root, visited: false }];
  const result: T[] = [];
  while (stack.length > 0) {
    const { node, visited } = stack.pop()!;
    if (visited) {
      result.push(node.value);
      continue;
    }

    stack.push({ node, visited: true });
    for (let index = node.children.length - 1; index >= 0; index--) {
      stack.push({ node: node.children[index], visited: false });
    }
  }
  return result;
}
