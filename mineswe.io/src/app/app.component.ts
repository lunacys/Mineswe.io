import { Component, OnInit } from "@angular/core";
import { LogFactoryService } from "./services/log-factory.service";
import { ILogger } from "./shared/logging/logger-interface";
import * as SignalR from "@microsoft/signalr";
import { AuthService } from "./services/auth.service";
import * as tree234 from "../assets/tree234.js";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    title = "minesweio";

    private _logger: ILogger;

    constructor(
        private logFactory: LogFactoryService,
        private authService: AuthService
    ) {
        this._logger = logFactory.getLogger("AppComponent");
    }

    async ngOnInit(): Promise<void> {
        await this.authService.tryAuthByToken();
    }
}
