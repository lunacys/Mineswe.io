import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subscription } from "rxjs";
import { UserService } from "./user.service";
import { LocalStorageService } from "./local-storage.service";
import { LogFactoryService } from "./log-factory.service";
import { ILogger } from "../shared/logging/logger-interface";

export interface UserData {
    id: number;
    username: string;
    email: string;
    token: string;
    role: {
        id: number;
        roleName: string;
    };
}

export interface Credentials {
    username: string;
    password: string;
}

export type AuthType = "none" | "asUser" | "asGuest";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private readonly _httpOptions: any;

    private _isSignedIn = false;
    private _authType: AuthType = "none";
    private _onAuthChanged: EventEmitter<AuthType> = new EventEmitter<AuthType>();
    private _token: string | null = null;

    private readonly _logger: ILogger;

    public get isSignedIn(): boolean {
        return this._isSignedIn;
    }

    public get token(): string | null {
        return this._token;
    }

    public subscribeOnAuthChanged(callback: (authType: AuthType) => void): Subscription {
        return this._onAuthChanged.subscribe(callback);
    }

    constructor(private http: HttpClient,
                private userService: UserService,
                private localStorageService: LocalStorageService,
                private logFactory: LogFactoryService) {
        this._httpOptions = {
            headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded"),
        };

        this._logger = logFactory.getLogger("AuthService");
    }

    public async auth(credentials: Credentials): Promise<UserData> {
        this._logger.logDebug("Authing");

        let result: UserData | null = null;

        try {
            result = await this.http
                .post<UserData>("/auth", this.createBody(credentials.username, credentials.password))
                .toPromise();
        } catch (ex) {
            throw new Error(this.getErrorMessage(ex));
        }

        if (result === null) {
            throw new Error("Invalid response data");
        }

        this.localStorageService.updateUser(result.username, result.token);
        this._token = result.token;
        this.authAsUser();

        return result;
    }

    public async tryAuthByToken(): Promise<UserData | null> {
        const existingUser = this.localStorageService.getUser();
        if (existingUser === null) {
            return null;
        }

        this._logger.logDebug("Found username and token, using it for auth");

        try {
            this._token = existingUser.token;
            this.authAsUser();
            return await this.userService.getUserData();
        } catch (ex) {
            this.signOut();
            throw new Error(ex.error.message);
        }
    }

    public authAsGuest(): void {
        this._isSignedIn = true;
        this._authType = "asGuest";
        this._onAuthChanged.emit(this._authType);
    }

    private authAsUser(): void {
        this._isSignedIn = true;
        this._authType = "asUser";
        this._onAuthChanged.emit(this._authType);
    }

    public signOut(): void {
        this.localStorageService.updateUser(null, null);
        this._token = null;
        this._isSignedIn = false;
        this._authType = "none";
        this._onAuthChanged.emit(this._authType);
    }

    private createBody(username: string, password: string): string {
        const body = new URLSearchParams();
        body.set("Username", username);
        body.set("Password", password);

        return body.toString();
    }
    private getErrorMessage(ex: any): string {
        if (ex && ex.error && ex.error.message) {
            return ex.error.message;
        }
        if (ex && ex.error) {
            return ex.error;
        }
        if (ex && ex.message) {
            return ex.message;
        }
        return ex.toString();
    }
}
