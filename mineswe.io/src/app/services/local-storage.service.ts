import { Injectable } from "@angular/core";

export interface UsernameTokenPair {
    username: string;
    token: string;
}

@Injectable({
    providedIn: "root"
})
export class LocalStorageService {
    constructor() {}

    public updateUser(username: string | null, token: string | null): void {
        if (username === null || token === null) {
            this.removeUsername();
            this.removeToken();
        } else {
            this.saveUsername(username);
            this.saveToken(token);
        }
    }

    public getUser(): UsernameTokenPair | null {
        const username = this.getUsername();
        const token = this.getToken();

        if (username === null || token === null) {
            return null;
        }

        return {
            username: username,
            token: token
        };
    }

    private saveUsername(username: string): void {
        localStorage.setItem("username", username);
    }

    private removeUsername(): void {
        localStorage.removeItem("username");
    }

    private getUsername(): string | null {
        const username = localStorage.getItem("username");
        if (!username) {
            return null;
        }
        return username;
    }

    private saveToken(token: string): void {
        localStorage.setItem("token", token);
    }

    private removeToken(): void {
        localStorage.removeItem("token");
    }

    private getToken(): string | null {
        const token = localStorage.getItem("token");
        if (!token) {
            return null;
        }
        return token;
    }
}
