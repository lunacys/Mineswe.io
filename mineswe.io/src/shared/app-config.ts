import { Injectable } from "@angular/core";
import { IAppConfig } from "./app-config-interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

// @dynamic
@Injectable({
    providedIn: 'root'
})
export class AppConfig {
    public get Settings(): IAppConfig {
        return AppConfig.settings;
    }

    /**
     * @deprecated
     * Inject this type and use Settings getter
     */
    private static settings: IAppConfig;
    constructor(private http: HttpClient) { }

    public async load(): Promise<void> {
        const jsonFile = `assets/config.${environment.name}.json`;
        await this.http.get<IAppConfig>(jsonFile).toPromise().then((response) => {
            AppConfig.settings = response;
        });
    }
}
