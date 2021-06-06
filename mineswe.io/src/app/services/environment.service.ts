import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";

export type EnvironmentMap = { [key: string]: any };

export const ENVIRONMENT = new InjectionToken<EnvironmentMap>("environment");

@Injectable({
    providedIn: "root",
})
export class EnvironmentService {
    private readonly _environment: EnvironmentMap;

    constructor(@Optional() @Inject(ENVIRONMENT) environment: EnvironmentMap) {
        this._environment = environment !== null ? environment : { production: false, name: "unknown" };
    }

    public getValue(key: string, defaultValue?: any): any {
        return this._environment[key] || defaultValue;
    }
}
