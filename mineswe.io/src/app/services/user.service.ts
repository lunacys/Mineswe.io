import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserData } from "./auth.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    constructor(private http: HttpClient) {}

    public async GetAll(): Promise<UserData[]> {
        const req = await this.http.get<UserData[]>("/user/getAll").toPromise();
        return req;
    }
}
