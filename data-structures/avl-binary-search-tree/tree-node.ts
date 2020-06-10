export default class TreeNode<T = unknown> {
  key: T;
  height: number;
  left: TreeNode<T> | undefined;
  right: TreeNode<T> | undefined;

  constructor(key: T) {
    this.key = key;
    this.height = 1;
  }
}
