import { Component, ElementRef, Host, NgZone, OnInit, ViewChild } from "@angular/core";
import { ILogger } from "../../shared/logging/logger-interface";
import { LogFactoryService } from "../../services/log-factory.service";
import { GameRoot } from "../../engine/core/game-root";
import { InputHandlerComponent } from "../input-handler-component/input-handler.component";

@Component({
    selector: "app-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.scss"],
    host: {
        class: "canvas-holder"
    }
})
export class GameComponent implements OnInit {
    public readonly gameWidth = 1600;
    public readonly gameHeight = 900;
    private _game: GameRoot;

    private _logger: ILogger;

    @ViewChild(InputHandlerComponent)
    private _inputHandler!: InputHandlerComponent;

    constructor(private elementRef: ElementRef,
                private ngZone: NgZone,
                private logFactory: LogFactoryService) {
        this._logger = logFactory.getLogger("GameComponent");
        this._game = new GameRoot(this.gameWidth, this.gameHeight);


    }

    async ngOnInit(): Promise<void> {
        //await this.ngZone.runOutsideAngular(async () => {
        try {
            await this._game.run((view) => {
                this.elementRef.nativeElement.appendChild(view);
            });
        } catch (ex) {
            this._logger.logError("Error while running the game: ", ex);
        }
        //});

        //this.elementRef.nativeElement.appendChild(this._game.Application.view);

        this._inputHandler.MouseMove.subscribe((event) => {

        });
    }
}
