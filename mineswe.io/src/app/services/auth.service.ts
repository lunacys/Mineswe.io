import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../shared/app-config";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { UserService } from "./user.service";
import { LocalStorageService } from "./local-storage.service";

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

    constructor(private http: HttpClient, private userService: UserService, private localStorageService: LocalStorageService) {
        this._httpOptions = {
            headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded"),
        };
    }

    public async auth(username: string, password: string): Promise<UserData> {
        const existingUser = this.localStorageService.getUser();
        if (existingUser !== null) {
            try {
                this._token = existingUser.token;
                this.authAsUser();
                return this.userService.getUserData();
            } catch (ex) {
                throw new Error(this.getErrorMessage(ex));
            }
        } else {
            let result: UserData | null = null;

            try {
                result = await this.http
                    .post<UserData>("/auth", this.createBody(username, password))
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
