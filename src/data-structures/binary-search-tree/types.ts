export type NodeKey = number | string | ICompositeKey;

export interface ICompositeKey {
  compareTo: (other: any) => Comparison;
}

export enum Comparison {
  Smaller,
  Equal,
  Greater
}
