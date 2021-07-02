export type Tree234CmpFn<T> = (v1: T, v2: T) => number;
export type Tree234CopyFn<T> = (state: T, element: T) => void;

export enum Tree234Relation {
    Eq,
    Lt,
    Le,
    Gt,
    Ge
}

export interface ITree234<T> {
    create(cmp: Tree234CmpFn<T>): ITree234<T>;
    destroy(): void;
    add(element: T): T;
    addAt(element: T, index: number): T;
    lookUp(index: number): T;
    find(element: T, cmp: Tree234CmpFn<T>): T;
    findRel(element: T, cmp: Tree234CmpFn<T>, relation: Tree234Relation): T;
    findAt(element: T, cmp: Tree234CmpFn<T>, index: number): [T, number];
    findRelAt(element: T, cmp: Tree234CmpFn<T>, relation: Tree234Relation, index: number): [T, number];
    remove(element: T): T;
    removeAt(element: T, index: number): T;
    count(): number;
    splitPos(tree: ITree234<T>, index: number, isBefore: boolean): ITree234<T>;
    split(tree: ITree234<T>, element: T, cmp: Tree234CmpFn<T>, relation: Tree234Relation): ITree234<T>;
    join(first: ITree234<T>, second: ITree234<T>): ITree234<T>;
    joinR(first: ITree234<T>, second: ITree234<T>): ITree234<T>;
    copy(tree: ITree234<T>, copyFn: Tree234CopyFn<T>, copyFnState: T): ITree234<T>;
}

export type Tree234NodeNullable<T> = Tree234Node<T> | null;

export class Tree234Node<T> {
    parent: Tree234NodeNullable<T> = null;
    kids?: Tree234NodeNullable<T>[] = [null, null, null, null];
    counts: number[] = [0, 0, 0, 0];
    elements: (T | null)[] = [null, null, null];
}

export class Tree234<T> implements ITree234<T> {
    public root: Tree234NodeNullable<T> = null;
    public cmpFn: Tree234CmpFn<T> | null = null;

    private constructor() {
    }

    public create(cmp: Tree234CmpFn<T>): ITree234<T> {
        const res = new Tree234<T>();
        res.root = null;
        res.cmpFn = cmp;
        return res;
    }

    public destroy(): void {
        this.root = null;
        this.cmpFn = null;
    }

    public static countFromNode<T>(node: Tree234Node<T>): number {
        let res = 0;
        for (let i = 0; i < 4; i++) {
            res += node.counts[i];
        }
        for (let i = 0; i < 3; i++) {
            if (node.elements[i] !== null) {
                res++;
            }
        }

        return res;
    }

    public count(): number {
        if (this.root) {
            return Tree234.countFromNode<T>(this.root);
        }

        return 0;
    }


}
