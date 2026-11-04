import type { TreeNode } from "./tree.js";
import { bfs } from "./bfs.js";
import { inorder } from "./inorder.js";
import { preorder } from "./preorder.js";
import { postorder } from "./postorder.js";

const tree: TreeNode<string> = {
  value: "A",
  children: [
    {
      value: "B",
      children: [
        { value: "E", children: [] },
        { value: "F", children: [] },
      ],
    },
    { value: "C", children: [] },
    {
      value: "D",
      children: [{ value: "G", children: [] }],
    },
  ],
};

console.log("BFS:", bfs(tree).join(", "));
console.log("DFS Inorder:", inorder(tree).join(", "));
console.log("DFS Preorder:", preorder(tree).join(", "));
console.log("DFS Postorder:", postorder(tree).join(", "));
