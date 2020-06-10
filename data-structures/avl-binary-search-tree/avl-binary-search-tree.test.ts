import * as bst from "./avl-binary-search-tree";
import type TreeNode from "./tree-node";

describe("AVL Binary Search Tree", () => {
  describe("preOrderTraversal", () => {
    it("returns nodes in the correct sequence", () => {
      let root = bst.insert(10);
      root = bst.insert(20, root);
      root = bst.insert(30, root);
      root = bst.insert(40, root);
      root = bst.insert(50, root);
      root = bst.insert(25, root);

      expect(Array.from(bst.preOrderTraversal(root)).map(n => n.key)).toEqual([
        30,
        20,
        10,
        25,
        40,
        50
      ]);
    });
  });

  describe("insert", () => {
    it("inserts left and right children", () => {
      let root = bst.insert(5);
      root = bst.insert(1, root);

      expect(root.key).toBe(5);
      expect(root.left?.key).toBe(1);
      expect(root.right?.key).toBeUndefined();

      bst.insert(10, root);
      expect(root.key).toBe(5);
      expect(root.left?.key).toBe(1);
      expect(root.right?.key).toBe(10);
    });

    it("inserts low values to the left and higher to the right", () => {
      let root = bst.insert(5);
      root = bst.insert(1, root);
      root = bst.insert(10, root);

      expect(root.key).toBe(5);
      expect(root.left?.key).toBe(1);
      expect(root.right?.key).toBe(10);
    });

    it("inserts nested values", () => {
      let root = bst.insert(10);
      root = bst.insert(2, root);
      root = bst.insert(30, root);
      root = bst.insert(40, root);

      expect(root.key).toBe(10);

      expect(root.left?.key).toBe(2);
      expect(root.right?.key).toBe(30);

      expect(root.right?.left).toBeUndefined();
      expect(root.right?.right?.key).toBe(40);
    });
  });

  describe("remove", () => {
    it("should remove node", () => {
      let root: TreeNode<number> | undefined = bst.insert(1);
      expect(bst.find(1, root)).toBeDefined();

      root = bst.remove(1, root);
      expect(bst.find(1, root)).toBeUndefined();
    });

    it("removes nested values", () => {
      let root: TreeNode | undefined = bst.insert(10);
      root = bst.insert(2, root);
      root = bst.insert(30, root);
      root = bst.insert(40, root);

      expect(root?.key).toBe(10);
      expect(root?.left?.key).toBe(2);
      expect(root?.right?.key).toBe(30);
      expect(root?.right?.left).toBeUndefined();
      expect(root?.right?.right?.key).toBe(40);

      root = bst.remove(30, root);

      expect(root?.key).toBe(10);
      expect(root?.left?.key).toBe(2);
      expect(root?.right?.key).toBe(40);

      root = bst.remove(10, root);

      expect(root?.key).toBe(40);
      expect(root?.left?.key).toBe(2);
    });
  });
});
