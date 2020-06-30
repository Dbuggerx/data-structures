import BinarySearchTree from "../binary-search-tree";
import TreeNode from "../binary-search-tree/tree-node";
import type { NodeKey } from "../binary-search-tree/types";

export default class AvlTree<T> extends BinarySearchTree<T> {
  private getBalanceFactor(node: TreeNode<T> | undefined): number {
    return !node ? 0 : (node.left?.height || 0) - (node.right?.height || 0);
  }

  private balance(node: TreeNode<T>) {
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor > 1)
      // left subtree is higher than the right subtree
      return this.getBalanceFactor(node.left) < 0
        ? this.rotateLeftRight(node)
        : this.rotateRight(node);

    if (balanceFactor < -1)
      // right subtree is higher than the left subtree
      return this.getBalanceFactor(node.right) > 0
        ? this.rotateRightLeft(node)
        : this.rotateLeft(node);

    return node;
  }

  private rotateRightLeft(node: TreeNode<T>) {
    node.right = node.right ? this.rotateRight(node.right) : node.right;
    return this.rotateLeft(node);
  }

  private rotateLeftRight(node: TreeNode<T>) {
    node.left = node.left ? this.rotateLeft(node.left) : node.left;
    return this.rotateRight(node);
  }

  private rotateLeft(node: TreeNode<T>) {
    if (!node.right) return node;

    const newParent = node.right;
    const temp = newParent.left;

    newParent.left = node;
    node.right = temp;

    node.height = this.getNodeHeight(node);
    newParent.height = this.getNodeHeight(newParent);

    return newParent;
  }

  private rotateRight(node: TreeNode<T>) {
    if (!node.left) return node;

    const newParent = node.left;
    const temp = newParent.right;

    newParent.right = node;
    node.left = temp;

    node.height = this.getNodeHeight(node);
    newParent.height = this.getNodeHeight(newParent);

    return newParent;
  }

  protected insertNode(nodeToAdd: TreeNode<T>, currentNode?: TreeNode<T>) {
    return this.balance(super.insertNode(nodeToAdd, currentNode));
  }

  protected removeNode(key: NodeKey, node?: TreeNode<T>) {
    const nodeToBalance = super.removeNode(key, node);
    return nodeToBalance ? this.balance(nodeToBalance) : undefined;
  }
}
