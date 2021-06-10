import { Component, OnInit } from "@angular/core";
import { LogFactoryService } from "./services/log-factory.service";
import { ILogger } from "./shared/logging/logger-interface";
import * as SignalR from "@microsoft/signalr";
import { AuthService } from "./services/auth.service";

export interface WeatherData {
    date: Date;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

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

        const connection = new SignalR.HubConnectionBuilder()
            .withUrl("https://localhost:44328/testHub")
            .build();

        await connection.start();

        await connection.invoke("TestMethod", "hello");
    }
}
