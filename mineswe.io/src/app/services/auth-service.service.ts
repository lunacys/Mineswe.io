import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHandler, HttpHeaders, HttpRequest } from "@angular/common/http";
import { AppConfig } from "../shared/app-config";
import { Subscription } from "rxjs";

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

export type AuthType = "none" | "asUser" | "asGuest";

@Injectable({
    providedIn: "root",
})
export class AuthServiceService {
    private readonly _httpOptions: any;

    private _isSignedIn = false;
    private _authType: AuthType = "none";
    private _onAuthChanged: EventEmitter<AuthType> = new EventEmitter<AuthType>();

    public get isSignedIn(): boolean {
        return this._isSignedIn;
    }

    public subscribeOnAuthChanged(callback: (authType: AuthType) => void): Subscription {
        return this._onAuthChanged.subscribe(callback);
    }

    constructor(private http: HttpClient, private appConfig: AppConfig) {
        this._httpOptions = {
            headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded"),
        };
    }

    public async auth(username: string, password: string): Promise<UserData> {
        let result: UserData;

        try {
            result = <UserData>((<unknown>(await this.http.post<UserData>(
                            this.appConfig.Settings.connection.apiBaseUrl + "/auth",
                            this.createBody(username, password),
                            this._httpOptions
                        )
                        .toPromise()
                ))
            );
        } catch (ex) {
            if (ex && ex.error && ex.error.message) {
                throw new Error(ex.error.message);
            }

            if (ex && ex.error) {
                throw new Error(ex.error);
            }

            if (ex && ex.message) {
                throw new Error(ex.message);
            }

            throw new Error(ex);
        }

        this.saveToken(result.token);
        this._isSignedIn = true;
        this._authType = "asUser";
        this._onAuthChanged.emit(this._authType);

        return result;
    }

    public authAsGuest(): void {
        this._isSignedIn = true;
        this._authType = "asGuest";
        this._onAuthChanged.emit(this._authType);
    }

    public signOut(): void {
        this.removeToken();
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

    private saveToken(token: string): void {
        localStorage.setItem("token", token);
    }

    private removeToken(): void {
        localStorage.removeItem("token");
    }
}
