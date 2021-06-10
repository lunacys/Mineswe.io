import { Component, ElementRef, NgZone, OnInit } from "@angular/core";
import * as PIXI from "pixi.js";
import { ILogger } from "../../shared/logging/logger-interface";
import { LogFactoryService } from "../../services/log-factory.service";
import { Color } from "../../engine/color";
import { GameRoot } from "../../engine/game-root";

@Component({
    selector: "app-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.scss"]
})
export class GameComponent implements OnInit {
    public readonly gameWidth = 800;
    public readonly gameHeight = 600;
    private _game: GameRoot;

    private _logger: ILogger;

    constructor(
        private elementRef: ElementRef,
        private ngZone: NgZone,
        private logFactory: LogFactoryService
    ) {
        this._logger = logFactory.getLogger("GameComponent");
        this._game = new GameRoot(800, 600);
    }

    async ngOnInit(): Promise<void> {
        await this.ngZone.runOutsideAngular(async () => {
           try {
               await this._game.run();
           } catch (ex) {
               this._logger.logError("Error while running the game: ", ex);
           }
        });

        this.elementRef.nativeElement.appendChild(this._game.Application.view);
    }
}
