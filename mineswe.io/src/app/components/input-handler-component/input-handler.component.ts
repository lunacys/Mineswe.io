import { Component, EventEmitter, HostListener, OnInit } from "@angular/core";
import { IInputHandler } from "../../engine/core/input-handler-interface";
import { MouseButton } from "../../engine/core/mouse-button-enum";
import { Vector2 } from "../../engine/core/vector2";

interface IMouseButtonMap {
    [key: number]: boolean;
}

interface IKeyMap {
    [key: string]: boolean;
}

@Component({
    selector: "app-input-handler-component",
    templateUrl: "./input-handler.component.html",
    styleUrls: ["./input-handler.component.scss"],
    host: {
        class: "absolute"
    }
})
export class InputHandlerComponent implements IInputHandler, OnInit {

    public get KeyDown(): EventEmitter<KeyboardEvent> {
        return this._keyDown;
    }
    public get KeyPressed(): EventEmitter<KeyboardEvent> {
        return this._keyPressed;
    }
    public get KeyReleased(): EventEmitter<KeyboardEvent> {
        return this._keyReleased;
    }

    public get MouseButtonDown(): EventEmitter<MouseEvent> {
        return this._mouseButtonDown;
    }
    public get MouseButtonPressed(): EventEmitter<MouseEvent> {
        return this._mouseButtonPressed;
    }
    public get MouseButtonUp(): EventEmitter<MouseEvent> {
        return this._mouseButtonUp;
    }
    public get MouseMove(): EventEmitter<MouseEvent> {
        return this._mouseMove;
    }

    public get MouseWheelDelta(): number {
        return this._mouseWheelDelta;
    }

    public get MousePosition(): Vector2 {
        return this._mousePosition;
    }

    public get MousePositionDelta(): Vector2 {
        return this._mousePositionDelta;
    }

    private _keyDown: EventEmitter<KeyboardEvent>;
    private _keyPressed: EventEmitter<KeyboardEvent>;
    private _keyReleased: EventEmitter<KeyboardEvent>;

    private _mouseButtonDown: EventEmitter<MouseEvent>;
    private _mouseButtonPressed: EventEmitter<MouseEvent>;
    private _mouseButtonUp: EventEmitter<MouseEvent>;
    private _mouseMove: EventEmitter<MouseEvent>;

    private _mouseWheelDelta: number;
    private _mousePosition: Vector2;
    private _mousePositionDelta: Vector2;

    private _isAltDown = false;
    private _isCtrlDown = false;
    private _isShiftDown = false;

    private _mouseButtonMap: IMouseButtonMap = { };
    private _keyMap: IKeyMap = { };

    constructor() {
        this._keyDown = new EventEmitter<KeyboardEvent>();
        this._keyPressed = new EventEmitter<KeyboardEvent>();
        this._keyReleased = new EventEmitter<KeyboardEvent>();

        this._mouseButtonDown = new EventEmitter<MouseEvent>();
        this._mouseButtonPressed = new EventEmitter<MouseEvent>();
        this._mouseButtonUp = new EventEmitter<MouseEvent>();
        this._mouseMove = new EventEmitter<MouseEvent>();

        this._mouseWheelDelta = 0;
        this._mousePosition = Vector2.Zero;
        this._mousePositionDelta = Vector2.Zero;
    }

    ngOnInit(): void {

    }

    public isAltDown(): boolean {
        return this._isAltDown;
    }

    public isCtrlDown(): boolean {
        return this._isCtrlDown;
    }

    public isShiftDown(): boolean {
        return this._isShiftDown;
    }

    public isKeyDown(code: string): boolean {
        return this._keyMap[code];
    }

    public isKeyPressed(code: string): boolean {
        throw new Error("Not Implemented");
    }

    public isKeyReleased(code: string): boolean {
        throw new Error("Not Implemented");
    }

    public isMouseButtonDown(mouseButton: MouseButton | number): boolean {
        return this._mouseButtonMap[<number>mouseButton];
    }

    public isMouseButtonPressed(mouseButton: MouseButton | number): boolean {
        throw new Error("Not Implemented");
    }

    public isMouseButtonReleased(mouseButton: MouseButton | number): boolean {
        throw new Error("Not Implemented");
    }

    @HostListener("window:keypress", ["$event"])
    private onKeyPress(event: KeyboardEvent) {
        this._keyPressed.emit(event);
    }

    @HostListener("window:keydown", ["$event"])
    private onKeyDown(event: KeyboardEvent) {
        this._keyMap[event.code] = true;

        if (event.code === "AltLeft" || event.code === "AltRight") {
            this._isAltDown = true;
        } else if (event.code === "ControlLeft" || event.code === "ControlRight") {
            this._isCtrlDown = true;
        } else if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
            this._isShiftDown = true;
        }

        this._keyDown.emit(event);
    }

    @HostListener("window:keyup", ["$event"])
    private onKeyUp(event: KeyboardEvent) {
        this._keyMap[event.code] = false;

        if (event.code === "AltLeft" || event.code === "AltRight") {
            this._isAltDown = false;
        } else if (event.code === "ControlLeft" || event.code === "ControlRight") {
            this._isCtrlDown = false;
        } else if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
            this._isShiftDown = false;
        }

        this._keyReleased.emit(event);
    }

    @HostListener("window:mousemove", ["$event"])
    private onMouseMove(event: MouseEvent) {
        this._mousePositionDelta.x = event.clientX - this._mousePosition.x;
        this._mousePositionDelta.y = event.clientY - this._mousePosition.y;

        this._mousePosition.x = event.clientX;
        this._mousePosition.y = event.clientY;

        this._mouseMove.emit(event);
    }

    @HostListener("window:mousedown", ["$event"])
    private onMouseDown(event: MouseEvent) {
        this._mouseButtonMap[event.button] = true;
        this._mouseButtonDown.emit(event);
    }

    @HostListener("window:click", ["$event"])
    private onMouseClick(event: MouseEvent) {
        this._mouseButtonPressed.emit(event);
    }

    @HostListener("window:mouseup", ["$event"])
    private onMouseUp(event: MouseEvent) {
        this._mouseButtonMap[event.button] = false;
        this._mouseButtonUp.emit(event);
    }

    @HostListener("window:wheel", ["$event"])
    private onMouseWheel(event: WheelEvent) {
        this._mouseWheelDelta = event.deltaY;
    }
}
