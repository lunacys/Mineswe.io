import { Injectable } from "@angular/core";
import { LoggerFactory } from "../shared/logging/logger-factory";
import { ILogger } from "../shared/logging/logger-interface";
import { AppConfig } from "../shared/app-config";

@Injectable({
    providedIn: "root"
})
export class LogFactoryService {
    constructor(appConfig: AppConfig) {
        LoggerFactory.initialize(appConfig.Settings);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public getLogger(context: string | object): ILogger {
        return LoggerFactory.getLogger(context);
    }
}
