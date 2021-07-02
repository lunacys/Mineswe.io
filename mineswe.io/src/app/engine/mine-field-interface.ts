import { Vector2 } from "./core/vector2";
import { FieldCell } from "./field-cell";

export interface IMineField {
    Width: number;
    Height: number;

    getCellAt(x: number, y: number): FieldCell;
}
