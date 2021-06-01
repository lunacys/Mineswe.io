import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../shared/app-config";

export interface UserData {
	id: number;
	username: string;
	email: string;
	token: string;
}

@Injectable({
  	providedIn: 'root'
})
export class AuthServiceService {
	private readonly _httpOptions: any;

  	constructor(private http: HttpClient, private appConfig: AppConfig) {
		this._httpOptions = {
			headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
		};
	}

	public async auth(username: string, password: string): Promise<UserData> {
  		const result = <UserData> <unknown> await this.http.post<UserData>(
  			this.appConfig.Settings.connection.apiAuthUrl + "/doAuth",
			this.createBody(username, password),
			this._httpOptions
        ).toPromise();

  		this.saveToken(result.token);

  		return result;
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
}
