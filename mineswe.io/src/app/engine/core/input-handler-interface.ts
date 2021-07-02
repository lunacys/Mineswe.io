import { MouseButton } from "./mouse-button-enum";
import { EventEmitter } from "@angular/core";
import { Vector2 } from "./vector2";

export interface IInputHandler {
    MouseWheelDelta: number;
    MousePosition: Vector2;
    MousePositionDelta: Vector2;

    KeyDown: EventEmitter<KeyboardEvent>;
    KeyPressed: EventEmitter<KeyboardEvent>;
    KeyReleased: EventEmitter<KeyboardEvent>;

    MouseButtonDown: EventEmitter<MouseEvent>;
    MouseButtonPressed: EventEmitter<MouseEvent>;
    MouseButtonUp: EventEmitter<MouseEvent>;
    MouseMove: EventEmitter<MouseEvent>;

    isShiftDown(): boolean;
    isCtrlDown(): boolean;
    isAltDown(): boolean;

    isKeyPressed(code: string): boolean;
    isKeyDown(code: string): boolean;
    isKeyReleased(code: string): boolean;
    isMouseButtonPressed(mouseButton: MouseButton): boolean;
    isMouseButtonDown(mouseButton: MouseButton): boolean;
    isMouseButtonReleased(mouseButton: MouseButton): boolean;
}
