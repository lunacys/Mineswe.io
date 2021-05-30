import * as PIXI from "pixi.js";
import "./style.css";

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

export class GameRoot {
    async loadGameAssets(): Promise<void> {
        return new Promise((res, rej) => {
            const loader = PIXI.Loader.shared;
            loader.add("rabbit", "./assets/simpleSpriteSheet.json");

            loader.onComplete.once(() => {
                res();
            });

            loader.onError.once(() => {
                rej();
            });

            loader.load();
        });
    }

    resizeCanvas(): void {
        const resize = () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            app.stage.scale.x = window.innerWidth / gameWidth;
            app.stage.scale.y = window.innerHeight / gameHeight;
        };

        resize();

        window.addEventListener("resize", resize);
    }

    getBird(): PIXI.AnimatedSprite {
        const bird = new PIXI.AnimatedSprite([
            PIXI.Texture.from("birdUp.png"),
            PIXI.Texture.from("birdMiddle.png"),
            PIXI.Texture.from("birdDown.png"),
        ]);

        bird.loop = true;
        bird.animationSpeed = 0.1;
        bird.play();
        bird.scale.set(3);

        return bird;
    }
}

const colorCornflowerBlue = 0x6495ed;

const app = new PIXI.Application({
    backgroundColor: colorCornflowerBlue,
    width: gameWidth,
    height: gameHeight,
});

const stage = app.stage;
const game = new GameRoot();

window.onload = async (): Promise<void> => {
    await game.loadGameAssets();

    document.body.appendChild(app.view);

    game.resizeCanvas();

    const birdFromSprite = game.getBird();
    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(gameWidth / 2, gameHeight / 2);

    stage.addChild(birdFromSprite);
};
