export class Vector2 {
    public x: number = 0;
    public y: number = 0;

    public static Zero = new Vector2();
    public static One = new Vector2(1, 1);
    public static UnitX = new Vector2(1, 0);
    public static UnitY = new Vector2(0, 1);

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public add(other: Vector2): void {
        this.x += other.x;
        this.y += other.y;
    }

    public subtract(other: Vector2): void {
        this.x -= other.x;
        this.y -= other.y;
    }

    public multiply(other: Vector2): void {
        this.x *= other.x;
        this.y *= other.y;
    }

    public divide(other: Vector2): void {
        this.x /= other.x;
        this.y /= other.y;
    }

    public negate(): void {
        this.x = -this.x;
        this.y = -this.y;
    }
}
