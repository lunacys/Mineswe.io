import { Logger } from "./logger";
import { LogLevel } from "./log-level";
import { LogTargetConsole } from "./log-targets/log-target-console";
import { ILogger } from "./logger-interface";
import { IAppConfig } from "../app-config-interface";
import { ILogTarget } from "./log-target-interface";

export interface LoggerConfigurationMap {
    [key: string]: LogLevel;
}

export interface LogTargetNamePair {
    name: string;
    logTarget: ILogTarget;
}

export class LoggerFactory {
    public static Configuration: LoggerConfigurationMap = {
        default: LogLevel.All
    };

    public static DefaultLogTargets = [new LogTargetConsole()];
    public static LogTargetNames: string[] = [];

    public static initialize(appConfig: IAppConfig) {

    }

    public static registerLogTarget(logTarget: ILogTarget) {

    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public static getLogger(context: string | object): ILogger {
        if (typeof context === "string") {
            return this.getLoggerString(context);
        } else if (typeof context === "object") {
            return this.getLoggerString(context.constructor.name);
        }

        throw new Error("Invalid context type: " + typeof context);
    }

    private static getLoggerString(context: string): ILogger {
        if (context in this.Configuration) {
            return new Logger(context, this.Configuration[context], this.DefaultLogTargets);
        } else {
            return new Logger(context, this.Configuration["default"], this.DefaultLogTargets);
        }
    }
}
