import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { ILogger } from "../../shared/logging/logger-interface";
import { LogFactoryService } from "../../services/log-factory.service";
import * as SignalR from "@microsoft/signalr";

@Component({
    selector: "app-sign-in-form",
    templateUrl: "./sign-in-form.component.html",
    styleUrls: ["./sign-in-form.component.scss"]
})
export class SignInFormComponent implements OnInit {
    public username = "";
    public password = "";

    public ErrorMessage: string | null = null;

    public get IsAuthed(): boolean {
        return this.authService.isSignedIn;
    }

    private readonly _logger: ILogger;

    constructor(private authService: AuthService,
                private userService: UserService,
                private logFactory: LogFactoryService) {
        this._logger = logFactory.getLogger("SignInFormComponent");
    }

    ngOnInit(): void {}

    async onLoginClick($event: MouseEvent): Promise<void> {
        $event.stopPropagation();

        try {
            const userData = await this.authService.auth({username: this.username, password: this.password});
            this._logger.logInfo("Authenticated successfully. Your data: ", userData);
            this.ErrorMessage = null;
        } catch (ex) {
            this._logger.logError("Error while auth: ", ex);
            this.ErrorMessage = ex;
        }
    }

    onSignOutClick($event: MouseEvent): void {
        $event.stopPropagation();

        this._logger.logInfo("Signing Out");

        this.authService.signOut();
    }

    async onGetAllUsersClick($event: MouseEvent): Promise<void> {
        $event.stopPropagation();

        try {
            await this.userService.GetAll();
            this.ErrorMessage = null;
        } catch (ex) {
            this._logger.logError("Error while getting all users: ", ex);
            this.ErrorMessage = ex.error.message;
        }
    }

    public async onConnectSignalRClick($event: MouseEvent): Promise<void> {
        const connection = new SignalR.HubConnectionBuilder()
            .withUrl("https://localhost:44328/testHub", {
                accessTokenFactory: () => this.authService.token || ""
            })
            .build();

        await connection.start();

        await connection.invoke("TestMethod", "hello");

        connection.on("testMethodClient", (args) => {
           console.log("Got message from SignalR server with args: ", args);
        });
    }
}
