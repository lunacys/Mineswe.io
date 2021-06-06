import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserData } from "./auth.service";

export interface KeyValuePairString {
    key: string;
    value: string;
}

@Injectable({
    providedIn: "root"
})
export class UserService {
    constructor(private http: HttpClient) {}

    public async GetAll(): Promise<UserData[]> {
        const req = await this.http.get<UserData[]>("/user/getAll").toPromise();
        return req;
    }

    public async getUserData(): Promise<UserData> {
        const req = await this.http.get<UserData>(
            "/user/getUserData",
        ).toPromise();
        return req;
    }

    private createBody(...keyValue: KeyValuePairString[]): string {
        const body = new URLSearchParams();

        for (const kv of keyValue) {
            body.set(kv.key, kv.value);
        }

        return body.toString();
    }
}
