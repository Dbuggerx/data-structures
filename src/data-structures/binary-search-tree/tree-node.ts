import { NodeKey, Comparison } from "./types";

export default class TreeNode<T> {
  key: NodeKey;
  value: T;
  height: number;
  left: TreeNode<T> | undefined;
  right: TreeNode<T> | undefined;

  constructor(key: NodeKey, value: T) {
    this.key = key;
    this.value = value;
    this.height = 1;
  }

  compareToKey(otherKey: NodeKey): Comparison {
    if (typeof this.key === "number" || typeof this.key === "string") {
      if (this.key < otherKey) return Comparison.Smaller;
      else if (this.key > otherKey) return Comparison.Greater;
      else return Comparison.Equal;
    }

    return this.key.compareTo(otherKey);
  }
}
