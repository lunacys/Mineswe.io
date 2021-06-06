import { LogLevel } from "./log-level";
import { ILogTarget } from "./log-target-interface";

export interface ILogger {
    LogLevel: LogLevel;
    Context: string;
    addLogTarget(logTarget: ILogTarget): void;
    log(logLevel: LogLevel, message: any, ...params: any[]): void;
    logAsync(logLevel: LogLevel, message: any, ...params: any[]): Promise<void>;

    logDebug(message: any, ...params: any[]): void;
    logInfo(message: any, ...params: any[]): void;
    logWarning(message: any, ...params: any[]): void;
    logError(message: any, ...params: any[]): void;
    logCritical(message: any, ...params: any[]): void;
}
