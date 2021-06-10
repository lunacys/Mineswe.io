import * as PIXI from "pixi.js";
import { ILogger } from "../shared/logging/logger-interface";
import { LoggerFactory } from "../shared/logging/logger-factory";
import { Color } from "./color";

export class GameRoot {
    public Application: PIXI.Application;
    public Stage: PIXI.Container;
    public get Width(): number {
        return this._width;
    }
    public get Height(): number {
        return this._height;
    }
    public get TotalTime(): number {
        return this._totalTime;
    }

    protected logger: ILogger;

    private _width: number;
    private _height: number;
    private _totalTime: number = 0;

    constructor(width: number = 800, height: number = 600) {
        this._width = width;
        this._height = height;

        this.Application = new PIXI.Application({
            backgroundColor: Color.CornflowerBlue,
            width: this.Width,
            height: this.Height,
            antialias: true,
            autoDensity: true,
            resolution: window.devicePixelRatio,
        });
        this.Stage = this.Application.stage;

        this.logger = LoggerFactory.getLogger("GameRoot");
    }

    public async run(): Promise<void> {
        await this.initialize();

    }

    protected async initialize(): Promise<void> {
        try {
            await this.loadAssets();
        } catch (ex) {
            this.logger.logError("Error while loading assets: ", ex);
        }

        this.resizeCanvas();

        const mineField = this.getMineField();
        mineField.pivot.x = 200;
        mineField.pivot.y = 200;
        mineField.position.x = window.innerWidth / 2;
        mineField.position.y = window.innerHeight / 2;
        const f2 = <PIXI.Sprite>mineField.getChildAt(1);
        f2.interactive = true;
        /*f2.tint = 0xff0000;*/
        f2.on("mouseover", ($event) => {
            f2.tint = 0xff0000;
            //f2.scale.x += 0.2;
            //f2.scale.y += 0.2;
            f2.zIndex += 1000;
            spinnerContainer.position.set(mineField.x, mineField.y);
            console.log("mouseenter - sprite");
        });
        f2.on("mouseout", ($event) => {
            f2.tint = 0xffffff;
            //f2.scale.x -= 0.2;
            //f2.scale.y -= 0.2;
            f2.zIndex -= 1000;
            console.log("mouseleave - sprite");
        });

        mineField.on("click", () => {
            console.log("mouseenter - mineField [on]");
        });
        mineField.addListener("click", () => {
            console.log("mouseenter - mineField [addListener]");
        });

        f2.addListener("mouseenter", () => {
            console.log("mouseover [addListener]");
        });

        this.Stage.addChild(mineField);

        window.addEventListener("wheel", ($event) => {
            if ($event.deltaY < 0 && mineField.scale.x < 3.0) {
                mineField.scale.x += 0.25;
                mineField.scale.y += 0.25;
            }
            if ($event.deltaY > 0 && mineField.scale.x > 0.25) {
                mineField.scale.x -= 0.25;
                mineField.scale.y -= 0.25;
            }
        });

        let oldMouseX = 0;
        let oldMouseY = 0;
        let dtX = 0;
        let dtY = 0;
        let mouseX = 0;
        let mouseY = 0;
        let dragging = false;

        window.addEventListener("mousemove", ($event) => {
            mouseX = $event.clientX;
            mouseY = $event.clientY;

            dtX = $event.clientX - oldMouseX;
            dtY = $event.clientY - oldMouseY;

            oldMouseX = $event.clientX;
            oldMouseY = $event.clientY;

            if (dragging) {
                mineField.position.x -= dtX;
                mineField.position.y -= dtY;
            }
        });

        window.addEventListener("mousedown", ($event) => {
            if ($event.button == 1) {
                $event.preventDefault();
                dragging = true;
            }
        });
        window.addEventListener("mouseup", ($event) => {
            if ($event.button == 1) {
                $event.preventDefault();
                /*mineField.position.x += dtX;
        mineField.position.y += dtY;*/
                dragging = false;
            }
        });
        window.addEventListener("keypress", ($event) => {
            console.log(`keypress: ${$event.key}, code: ${$event.code}`);
        });
        window.addEventListener("keydown", ($event) => {
            console.log(`keydown: ${$event.key}, code: ${$event.code}`);
        });
        window.addEventListener("keyup", ($event) => {
            console.log(`keyup: ${$event.key}, code: ${$event.code}`);
        });

        let spinnerContainer: PIXI.Container;

        const generateSpinner = (position: PIXI.Point) => {
            const container = new PIXI.Container();
            spinnerContainer = container;
            container.interactive = true;
            container.position.set(position.x, position.y);
            this.Stage.addChild(container);

            const halfCircle = new PIXI.Graphics();
            halfCircle.beginFill(0xff0000);
            halfCircle.lineStyle(2, 0xffffff);
            halfCircle.arc(0, 0, 100, 0, Math.PI);
            halfCircle.endFill();
            halfCircle.position.set(50, 50);

            const rectangle = new PIXI.Graphics();
            rectangle.lineStyle(5, 0x444444, 1);
            rectangle.drawRoundedRect(0, 0, 100, 100, 16);
            rectangle.endFill();
            rectangle.mask = halfCircle;
            rectangle.zIndex = -100000;

            container.addChild(rectangle);
            container.addChild(halfCircle);

            container.pivot.set(50, 50);

            let phase = 0;
            return (delta: number) => {
                // Update phase
                phase += delta / 50;
                phase %= Math.PI * 2;

                halfCircle.rotation = phase;
            };
        };

        let totalTime = 0;

        const spinners = [generateSpinner(new PIXI.Point(128, 128))];

        function gameLoop(delta: number): void {
            // birdFromSprite.x += birdSpeed * delta;
            //mineField.scale.x += 0.01;
            //mineField.scale.y += 0.01;
            // mineField.rotation += 0.01;
            totalTime += delta;
            //const a = (Math.sin(totalTime / 20) + 1);
            // generateSpinner(new PIXI.Point(128, 128))(delta);
            //console.log(a);

            spinners.forEach((cb) => {
                cb(delta);
            });
        }

        if (this.Application) {
            this.Application.ticker.add((delta) => {
                this._totalTime += delta;
                this.update(delta);

                spinners.forEach((cb) => {
                    cb(delta);
                });
            });
        }
    }

    protected update(dt: number): void {

    }

    protected render(renderer: PIXI.Renderer): void {

    }

    private loadAssets(): Promise<void> {
        return new Promise((res, rej) => {
            const loader = PIXI.Loader.shared;
            loader.add("mineField", "./assets/Tileset_Field.json");

            loader.onComplete.once(() => {
                res();
            });

            loader.onError.once((err) => {
                rej(err);
            });

            loader.load();
        });
    }

    private getMineField(): PIXI.Container {
        const container = new PIXI.Container();

        const cell1 = new PIXI.Sprite(PIXI.Texture.from("cellOpen1.png"));
        cell1.pivot.set(50, 50);
        cell1.position.set(100, 100);
        const cell2 = new PIXI.Sprite(PIXI.Texture.from("cellOpen2.png"));
        cell2.pivot.set(50, 50);
        cell2.position.set(200, 100);
        const cellClosed = new PIXI.Sprite(PIXI.Texture.from("cellClosed.png"));
        cellClosed.pivot.set(50, 50);
        cellClosed.position.set(100, 200);
        const cellOpen = new PIXI.Sprite(PIXI.Texture.from("cellOpenEmpty.png"));
        cellOpen.pivot.set(50, 50);
        cellOpen.position.set(200, 200);

        container.addChild(cell1);
        container.addChild(cell2);
        container.addChild(cellClosed);
        container.addChild(cellOpen);

        return container;
    }

    private resizeCanvas(): void {
        const resize = () => {
            if (this.Application) {
                //this.app.renderer.resize(window.innerWidth, window.innerHeight);
            }
            //app.stage.scale.x = window.innerWidth / gameWidth;
            //app.stage.scale.y = window.innerHeight / gameHeight;
        };

        resize();

        window.addEventListener("resize", resize);
    }
}
