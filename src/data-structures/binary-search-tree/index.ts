import TreeNode from "./tree-node";
import { NodeKey, Comparison } from "./types";

export default class BinarySearchTree<T> {
  protected rootNode: TreeNode<T> | undefined;

  get root() {
    return this.rootNode as Readonly<TreeNode<T> | undefined>;
  }

  private findNode(key: NodeKey, node?: TreeNode<T>): TreeNode<T> | undefined {
    if (!node || node.compareToKey(key) === Comparison.Equal) return node;
    return node.compareToKey(key) === Comparison.Greater
      ? this.findNode(key, node.left)
      : this.findNode(key, node.right);
  }

  protected getNodeHeight(node: TreeNode<T>): number {
    return Math.max(node.left?.height || 0, node.right?.height || 0) + 1;
  }

  protected insertNode(nodeToAdd: TreeNode<T>, currentNode?: TreeNode<T>) {
    if (!currentNode) return nodeToAdd;

    if (currentNode.compareToKey(nodeToAdd.key) === Comparison.Greater)
      currentNode.left = this.insertNode(nodeToAdd, currentNode.left);
    else currentNode.right = this.insertNode(nodeToAdd, currentNode.right);

    currentNode.height = this.getNodeHeight(currentNode);

    return currentNode;
  }

  protected removeNode(key: NodeKey, currentNode?: TreeNode<T>) {
    if (!currentNode) return undefined;

    const currentNodeComparison = currentNode.compareToKey(key);

    // If the key to be deleted is smaller than the node's key, then it lies in the left subtree
    if (currentNodeComparison === Comparison.Greater)
      currentNode.left = this.removeNode(key, currentNode.left);
    // If the key to be deleted is greater than the node's key, then it lies in the right subtree
    else if (currentNodeComparison === Comparison.Smaller)
      currentNode.right = this.removeNode(key, currentNode.right);
    // if key is same as node's key, then this is the node to be deleted
    else if (!currentNode.left || !currentNode.right) {
      return currentNode.left || currentNode.right;
    } else {
      // node with two children: get the inorder successor (smallest in the right subtree)
      const temp = this.getMinValueNode(currentNode.right);

      // Copy the inorder successor's data to this node
      currentNode.key = temp.key;
      currentNode.value = temp.value;

      // Delete the inorder successor
      currentNode.right = this.removeNode(temp.key, currentNode.right);
    }

    currentNode.height = this.getNodeHeight(currentNode);
    return currentNode;
  }

  private getMinValueNode(node: TreeNode<T>) {
    let current = node;

    // loop down to find the leftmost leaf
    while (current.left) current = current.left;

    return current;
  }

  add(key: NodeKey, value: T) {
    const nodeToAdd = new TreeNode(key, value);
    this.rootNode = this.insertNode(nodeToAdd, this.rootNode);
    return nodeToAdd as Readonly<TreeNode<T>>;
  }

  remove(key: NodeKey) {
    this.rootNode = this.removeNode(key, this.rootNode);
    return this;
  }

  find(key: NodeKey): T | undefined {
    return this.findNode(key, this.rootNode)?.value;
  }

  *inOrderTraversal(
    node: TreeNode<T> | undefined = this.rootNode
  ): IterableIterator<Readonly<NodeEntry<T>>> {
    if (!node) return;

    if (node.left) yield* this.inOrderTraversal(node.left);
    yield { key: node.key, value: node.value };
    if (node.right) yield* this.inOrderTraversal(node.right);
  }

  *reverseInOrderTraversal(
    node: TreeNode<T> | undefined = this.rootNode
  ): IterableIterator<Readonly<NodeEntry<T>>> {
    if (!node) return;

    if (node.right) yield* this.reverseInOrderTraversal(node.right);
    yield { key: node.key, value: node.value };
    if (node.left) yield* this.reverseInOrderTraversal(node.left);
  }
}

type NodeEntry<T> = Pick<TreeNode<T>, "key" | "value">;
