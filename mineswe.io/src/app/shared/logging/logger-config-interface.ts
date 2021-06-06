import { LogLevel } from "./log-level";
import { ILogTarget } from "./log-target-interface";

export interface LoggerConfigMap {
    [key: string]: LogLevel;
}

export interface ILoggerConfig {
    configuration: LoggerConfigMap;
    defaultLogTargets: ILogTarget[];
}
