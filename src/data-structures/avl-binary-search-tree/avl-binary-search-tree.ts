import TreeNode from "./tree-node";

/**
 * @tutorial https://adrianmejia.com/self-balanced-binary-search-trees-with-avl-tree-data-structure-for-beginners/#Right-Rotation
 */
function rotateRight<T>(node: TreeNode<T>): TreeNode<T> {
  if (!node.left) return node;
  const newParent = node.left;
  const temp = newParent.right;

  // Perform rotation
  newParent.right = node;
  node.left = temp;

  // Update heights
  node.height = getNodeHeight(node);
  newParent.height = getNodeHeight(newParent);

  // Return new root
  return newParent;
}

function getNodeHeight<T>(node: TreeNode<T>): number {
  return Math.max(node.left?.height || 0, node.right?.height || 0) + 1;
}

/**
 * @tutorial https://adrianmejia.com/self-balanced-binary-search-trees-with-avl-tree-data-structure-for-beginners/#Left-Rotation
 */
function rotateLeft<T>(node: TreeNode<T>): TreeNode<T> {
  if (!node.right) return node;
  const newParent = node.right;
  const temp = newParent.left;

  // Perform rotation
  newParent.left = node;
  node.right = temp;

  // Update heights
  node.height = getNodeHeight(node);
  newParent.height = getNodeHeight(newParent);

  // Return new root
  return newParent;
}

/**
 * @tutorial https://adrianmejia.com/self-balanced-binary-search-trees-with-avl-tree-data-structure-for-beginners/#Left-Right-Rotation
 */
function rotateLeftRight<T>(node: TreeNode<T>) {
  node.left = rotateLeft(node.left!);
  return rotateRight(node);
}

/**
 * @tutorial https://adrianmejia.com/self-balanced-binary-search-trees-with-avl-tree-data-structure-for-beginners/#Right-Left-Rotation
 */
function rotateRightLeft<T>(node: TreeNode<T>) {
  node.right = rotateRight(node.right!);
  return rotateLeft(node);
}

function getBalance<T>(node: TreeNode<T> | undefined): number {
  return !node ? 0 : (node.left?.height || 0) - (node.right?.height || 0);
}

/**
 * @tutorial https://www.geeksforgeeks.org/avl-tree-set-1-insertion/
 * @tutorial https://adrianmejia.com/self-balanced-binary-search-trees-with-avl-tree-data-structure-for-beginners
 */
export function insert<T>(key: T, node?: TreeNode<T>): TreeNode<T> {
  // Perform the normal BST insertion
  if (!node) return new TreeNode(key);

  if (key < node.key) node.left = insert(key, node.left);
  else node.right = insert(key, node.right);

  // Update height of this ancestor node
  node.height = getNodeHeight(node);

  // Balance the node tree
  return balance(node);
}

/**
 * Given a non-empty binary search tree, return the
 * node with minimum key value found in that tree.
 * Note that the entire tree does not need to be
 * searched.
 * @author: https://www.geeksforgeeks.org/avl-tree-set-2-deletion/
 */
function minValueNode<T>(node: TreeNode<T>): TreeNode<T> {
  let current = node;

  /* loop down to find the leftmost leaf */
  while (current.left) current = current.left;

  return current;
}

/**
 * Recursive function to delete a node with
 * given key from subtree with given root
 * @returns root of the modified subtree
 * @tutorial https://www.geeksforgeeks.org/avl-tree-set-2-deletion/
 * @tutorial https://adrianmejia.com/self-balanced-binary-search-trees-with-avl-tree-data-structure-for-beginners
 */
export function remove<T>(key: T, node?: TreeNode<T>) {
  if (!node) return node;

  // If the key to be deleted is smaller than
  // the root's key, then it lies in left subtree
  if (key < node.key) node.left = remove(key, node.left);
  // If the key to be deleted is greater than the
  // root's key, then it lies in right subtree
  else if (key > node.key) node.right = remove(key, node.right);
  // if key is same as root's key, then this is the node
  // to be deleted
  else {
    if (!node.left || !node.right) {
      let temp = node.left || node.right;

      // No child case
      if (!temp) {
        temp = node;
        node = undefined;
      }
      // One child case
      // Copy the contents of the non-empty child
      else node = temp;
    } else {
      // node with two children: Get the inorder
      // successor (smallest in the right subtree)
      const temp = minValueNode(node.right);

      // Copy the inorder successor's data to this node
      node.key = temp.key;

      // Delete the inorder successor
      node.right = remove(temp.key, node.right);
    }
  }

  // If the tree had only one node then return
  if (!node) return node;

  node.height = getNodeHeight(node);

  return balance(node);
}

/**
 * @author https://github.com/amejiarosario/dsa.js-data-structures-algorithms-javascript/blob/master/src/data-structures/trees/avl-tree.js#L22
 */
function balance<T>(node: TreeNode<T>) {
  const balance = getBalance(node);
  if (balance > 1)
    // left subtree is higher than right subtree
    return getBalance(node.left) < 0 ? rotateLeftRight(node) : rotateRight(node);

  if (balance < -1)
    // right subtree is higher than left subtree
    return getBalance(node.right) > 0 ? rotateRightLeft(node) : rotateLeft(node);

  return node;
}

export function find<T>(key: T, node?: TreeNode<T>): TreeNode<T> | undefined {
  if (!node || node.key === key) return node;
  return key < node.key ? find(key, node.left) : find(key, node.right);
}

/**
 * Pre-order traversal on a tree: root-left-right.
 * Similar results to DFS
 * @param node first node to start the traversal
 * @author https://github.com/amejiarosario/dsa.js-data-structures-algorithms-javascript/blob/master/src/data-structures/trees/binary-search-tree.js#L229
 * @tutorial https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/
 */
export function* preOrderTraversal<T>(node: TreeNode<T>): IterableIterator<TreeNode<T>> {
  yield node;
  if (node.left) yield* preOrderTraversal(node.left);
  if (node.right) yield* preOrderTraversal(node.right);
}
