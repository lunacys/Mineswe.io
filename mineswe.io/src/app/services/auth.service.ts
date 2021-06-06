import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../shared/app-config";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";

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
export class AuthService {
    private readonly _httpOptions: any;

    private _isSignedIn = false;
    private _authType: AuthType = "none";
    private _onAuthChanged: EventEmitter<AuthType> = new EventEmitter<AuthType>();
    private _token: string | null = null;

    public get isSignedIn(): boolean {
        return this._isSignedIn;
    }

    public get token(): string | null {
        return this._token;
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
            /*result = <UserData>((<unknown>(await this.http.post<UserData>(
                            this.appConfig.Settings.connection.apiBaseUrl + "/auth",
                            this.createBody(username, password),
                            this._httpOptions
                        )
                        .toPromise()
                ))
            );*/
            result = await this.http
                .post<UserData>("/auth", this.createBody(username, password), {
                    responseType: "json",
                    headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                })
                .pipe(tap(response => console.log("Sent login", response)))
                .toPromise();
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

        this.updateToken(result.token);
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
        this.updateToken(null);
        this._isSignedIn = false;
        this._authType = "none";
        this._onAuthChanged.emit(this._authType);
    }

    private updateToken(token: string | null) {
        this._token = token;

        if (token) {
            this.saveToken(token);
        } else {
            this.removeToken();
        }
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
