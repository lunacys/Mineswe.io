import { IMineField } from "./mine-field-interface";
import * as PIXI from "pixi.js";
import { FieldCell } from "./field-cell";

class TextureResolver {
    private readonly _textures: PIXI.Texture[] = [];

    constructor() {
        // Firstly numbered cells (0-8)
        for (let i = 0; i < 9; i++) {
            this._textures.push(PIXI.Texture.from("cellOpen" + i + ".png"));
        }

        // Closed
        this._textures.push(PIXI.Texture.from("cellClosed.png"));
        // Flag
        this._textures.push(PIXI.Texture.from("cellClosedFlag.png"));
        // Mine
        this._textures.push(PIXI.Texture.from("cellOpenMine.png"));
    }

    public getTextureForCell(cell: FieldCell): PIXI.Texture {
        if (cell.IsFlagged) {
            return this._textures[10];
        }
        if (!cell.IsOpen) {
            return this._textures[9];
        }
        if (cell.IsMine) {
            return this._textures[11];
        }

        return this._textures[cell.MinesAround];
    }
}

export class MineFieldRenderer {
    public readonly MineField: IMineField;

    private readonly _textureResolver: TextureResolver;

    constructor(mineField: IMineField) {
        this.MineField = mineField;
        this._textureResolver = new TextureResolver();
    }

    public renderToContainer(): PIXI.Container {
        const container = new PIXI.Container();

        for (let y = 0; y < this.MineField.Height; y++) {
            for (let x = 0; x < this.MineField.Width; x++) {
                const cell = this.MineField.getCellAt(x, y);

                const sprite = new PIXI.Sprite(this._textureResolver.getTextureForCell(cell));
                sprite.pivot.set(50, 50);
                sprite.position.set(x * 100, y * 100);
                sprite.interactive = true;
                sprite.on("mouseover", (event) => {
                    sprite.tint = 0xff0000;
                })

                container.addChild(sprite);

                if (!cell.IsMine && cell.IsOpen) {
                    // Outline rectangle
                    const rect = new PIXI.Graphics();
                    rect.lineStyle(1, 0xaaaaaa, 0.5);
                    rect.drawRect(x * 100, y * 100, 100, 100);
                    rect.endFill();

                    container.addChild(rect);
                }
            }
        }

        container.interactive = true;
        return container;
    }
}
