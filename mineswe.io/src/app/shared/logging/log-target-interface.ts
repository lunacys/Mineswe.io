import { LogLevel } from "./log-level";

export interface ILogTarget {
    getName(): string;
    log(level: LogLevel, message: any): void;
    logAsync(level: LogLevel, message: any): Promise<void>;
}
