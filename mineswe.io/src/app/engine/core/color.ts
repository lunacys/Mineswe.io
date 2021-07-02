export class Color {
    public static readonly CornflowerBlue = 0x6495ed;

    public R: number;
    public G: number;
    public B: number;
    public A: number;

    constructor(r: number, g: number, b: number, a: number) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }
}
