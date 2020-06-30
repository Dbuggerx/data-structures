import AvlTree from "./index";
import { ICompositeKey, Comparison } from "../binary-search-tree/types";

describe("AVL Tree", () => {
  describe("primitive keys", () => {
    describe("add", () => {
      it("adds root node", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(10, "a");
        avlTree.add(20, "b");

        expect(avlTree.root).toEqual(
          expect.objectContaining({
            key: 10,
            value: "a",
            height: 2
          })
        );
      });

      it("returns added node", () => {
        const avlTree = new AvlTree<string>();

        expect(avlTree.add(10, "a")).toEqual({
          key: 10,
          value: "a",
          height: 1
        });

        expect(avlTree.add(20, "b")).toEqual({
          key: 20,
          value: "b",
          height: 1
        });
      });

      it("adds nested nodes", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(10, "a");
        avlTree.add(9, "b");
        avlTree.add(8, "c");
        avlTree.add(90, "d");
        avlTree.add(190, "e");
        avlTree.add(5, "f");
        avlTree.add(6, "g");
        avlTree.add(2, "h");
        avlTree.add(80, "i");
        avlTree.add(3, "j");
        avlTree.add(70, "k");
        avlTree.add(4, "l");

        expect(avlTree.root).toMatchSnapshot();

        avlTree.add(7, "m");
        expect(avlTree.root).toMatchSnapshot();
      });
    });

    describe("traversal", () => {
      let avlTree: AvlTree<string>;

      beforeEach(() => {
        avlTree = new AvlTree();
        avlTree.add(20, "a");
        avlTree.add(10, "b");
        avlTree.add(30, "c");
        avlTree.add(15, "d");
        avlTree.add(50, "e");
      });

      it("iterates in order", () => {
        expect(Array.from(avlTree.inOrderTraversal())).toEqual([
          { key: 10, value: "b" },
          { key: 15, value: "d" },
          { key: 20, value: "a" },
          { key: 30, value: "c" },
          { key: 50, value: "e" }
        ]);
      });

      it("iterates in reverse order", () => {
        expect(Array.from(avlTree.reverseInOrderTraversal())).toEqual([
          { key: 50, value: "e" },
          { key: 30, value: "c" },
          { key: 20, value: "a" },
          { key: 15, value: "d" },
          { key: 10, value: "b" }
        ]);
      });
    });

    describe("remove", () => {
      it("removes root node", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(10, "a");
        expect(avlTree.root?.key).toBe(10);

        avlTree.remove(10);
        expect(avlTree.root).toBeUndefined();
      });

      it("does nothing for non existing node", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(10, "a");

        avlTree.remove(1);
        expect(avlTree.root?.key).toBe(10);
      });

      it("removes nested nodes", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(10, "a");
        avlTree.add(9, "b");
        avlTree.add(8, "c");
        avlTree.add(90, "d");
        avlTree.add(190, "e");
        avlTree.add(5, "f");
        avlTree.add(6, "g");
        avlTree.add(2, "h");
        avlTree.add(80, "i");
        avlTree.add(3, "j");
        avlTree.add(70, "k");
        avlTree.add(4, "l");

        avlTree.remove(9);
        expect(avlTree.root).toMatchSnapshot();

        avlTree.remove(80);
        expect(avlTree.root).toMatchSnapshot();
      });
    });

    describe("find", () => {
      it("finds existing nodes", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(20, "a");
        avlTree.add(10, "b");
        avlTree.add(30, "c");

        expect(avlTree.find(30)).toEqual("c");
        expect(avlTree.find(10)).toEqual("b");
        expect(avlTree.find(20)).toEqual("a");
      });

      it("does not find non existing node", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(20, "a");
        avlTree.add(10, "b");
        avlTree.add(30, "c");

        expect(avlTree.find(50)).toBeUndefined();
      });
    });
  });

  describe("composite keys", () => {
    class DummyCompositeKey implements ICompositeKey {
      constructor(private id: number, private name: string) {}

      compareTo(other: DummyCompositeKey) {
        return this.id === other.id ? this.compareToName(other) : this.compareToId(other);
      }

      compareToId(other: DummyCompositeKey) {
        if (this.id > other.id) return Comparison.Greater;
        else if (this.id < other.id) return Comparison.Smaller;
        return Comparison.Equal;
      }

      compareToName(other: DummyCompositeKey) {
        if (this.name > other.name) return Comparison.Greater;
        else if (this.name < other.name) return Comparison.Smaller;
        return Comparison.Equal;
      }
    }

    describe("add", () => {
      it("adds root node", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(new DummyCompositeKey(10, "aaa"), "a");
        avlTree.add(new DummyCompositeKey(20, "bbb"), "b");

        expect(avlTree.root).toEqual(
          expect.objectContaining({
            key: {
              id: 10,
              name: "aaa"
            },
            value: "a",
            height: 2
          })
        );
      });

      it("returns added node", () => {
        const avlTree = new AvlTree<string>();

        expect(avlTree.add(new DummyCompositeKey(10, "aaa"), "a")).toEqual({
          key: {
            id: 10,
            name: "aaa"
          },
          value: "a",
          height: 1
        });

        expect(avlTree.add(new DummyCompositeKey(10, "bbb"), "b")).toEqual({
          key: {
            id: 10,
            name: "bbb"
          },
          value: "b",
          height: 1
        });

        expect(avlTree.add(new DummyCompositeKey(20, "ccc"), "c")).toEqual({
          key: {
            id: 20,
            name: "ccc"
          },
          value: "c",
          height: 1
        });
      });

      it("adds nested nodes", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(new DummyCompositeKey(10, "aaa"), "a");
        avlTree.add(new DummyCompositeKey(9, "bbb"), "b");
        avlTree.add(new DummyCompositeKey(8, "ccc"), "c");
        avlTree.add(new DummyCompositeKey(10, "ddd"), "d");
        avlTree.add(new DummyCompositeKey(20, "eee"), "e");
        avlTree.add(new DummyCompositeKey(9, "fff"), "f");

        expect(avlTree.root).toMatchSnapshot();
      });
    });

    describe("traversal", () => {
      let avlTree: AvlTree<string>;

      beforeEach(() => {
        avlTree = new AvlTree<string>();
        avlTree.add(new DummyCompositeKey(10, "aaa"), "a");
        avlTree.add(new DummyCompositeKey(9, "bbb"), "b");
        avlTree.add(new DummyCompositeKey(8, "ccc"), "c");
        avlTree.add(new DummyCompositeKey(10, "ddd"), "d");
        avlTree.add(new DummyCompositeKey(20, "eee"), "e");
        avlTree.add(new DummyCompositeKey(9, "fff"), "f");
      });

      it("iterates in order", () => {
        expect(Array.from(avlTree.inOrderTraversal())).toEqual([
          { key: { id: 8, name: "ccc" }, value: "c" },
          { key: { id: 9, name: "bbb" }, value: "b" },
          { key: { id: 9, name: "fff" }, value: "f" },
          { key: { id: 10, name: "aaa" }, value: "a" },
          { key: { id: 10, name: "ddd" }, value: "d" },
          { key: { id: 20, name: "eee" }, value: "e" }
        ]);
      });

      it("iterates in reverse order", () => {
        expect(Array.from(avlTree.reverseInOrderTraversal())).toEqual([
          { key: { id: 20, name: "eee" }, value: "e" },
          { key: { id: 10, name: "ddd" }, value: "d" },
          { key: { id: 10, name: "aaa" }, value: "a" },
          { key: { id: 9, name: "fff" }, value: "f" },
          { key: { id: 9, name: "bbb" }, value: "b" },
          { key: { id: 8, name: "ccc" }, value: "c" }
        ]);
      });
    });

    describe("remove", () => {
      it("removes root node", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(new DummyCompositeKey(10, "aaa"), "a");

        avlTree.remove(new DummyCompositeKey(10, "aaa"));
        expect(avlTree.root).toBeUndefined();
      });

      it("does nothing for non existing node", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(new DummyCompositeKey(10, "aaa"), "a");

        avlTree.remove(new DummyCompositeKey(10, "bbb"));
        expect(avlTree.root?.key).toEqual({
          id: 10,
          name: "aaa"
        });
      });

      it("removes nested nodes", () => {
        const avlTree = new AvlTree<string>();
        avlTree.add(new DummyCompositeKey(10, "aaa"), "a");
        avlTree.add(new DummyCompositeKey(9, "bbb"), "b");
        avlTree.add(new DummyCompositeKey(8, "ccc"), "c");
        avlTree.add(new DummyCompositeKey(90, "ddd"), "d");
        avlTree.add(new DummyCompositeKey(190, "eee"), "e");
        avlTree.add(new DummyCompositeKey(5, "fff"), "f");
        avlTree.add(new DummyCompositeKey(6, "ggg"), "g");
        avlTree.add(new DummyCompositeKey(2, "hhh"), "h");
        avlTree.add(new DummyCompositeKey(80, "iii"), "i");
        avlTree.add(new DummyCompositeKey(3, "jjj"), "j");
        avlTree.add(new DummyCompositeKey(70, "kkk"), "k");
        avlTree.add(new DummyCompositeKey(4, "lll"), "l");
        avlTree.add(new DummyCompositeKey(70, "mmm"), "m");

        avlTree.remove(new DummyCompositeKey(70, "kkk"));
        expect(avlTree.root).toMatchSnapshot();

        avlTree.remove(new DummyCompositeKey(8, "ccc"));
        expect(avlTree.root).toMatchSnapshot();
      });
    });

    describe("find", () => {
      let avlTree: AvlTree<string>;

      beforeEach(() => {
        avlTree = new AvlTree<string>();
        avlTree.add(new DummyCompositeKey(20, "aaa"), "a");
        avlTree.add(new DummyCompositeKey(10, "bbb"), "b");
        avlTree.add(new DummyCompositeKey(30, "ccc"), "c");
        avlTree.add(new DummyCompositeKey(10, "ddd"), "d");
      });

      it("finds existing nodes", () => {
        expect(avlTree.find(new DummyCompositeKey(30, "ccc"))).toEqual("c");
        expect(avlTree.find(new DummyCompositeKey(10, "bbb"))).toEqual("b");
        expect(avlTree.find(new DummyCompositeKey(20, "aaa"))).toEqual("a");
      });

      it("does not find non existing node", () => {
        expect(avlTree.find(new DummyCompositeKey(50, "aaa"))).toBeUndefined();
      });
    });
  });
});
