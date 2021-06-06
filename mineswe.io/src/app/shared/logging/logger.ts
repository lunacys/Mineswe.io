import { ILogTarget } from "./log-target-interface";
import { LogLevel } from "./log-level";
import { ILogger } from "./logger-interface";

export type LoggerWriteFunc = (level: LogLevel, message?: any, ...optParams: any[]) => void;

export class Logger implements ILogger {
    private readonly _context: string;
    public get Context(): string {
        return this._context;
    }

    private readonly _logLevel: LogLevel;
    public get LogLevel(): LogLevel {
        return this._logLevel;
    }

    private readonly _activeLoggers: ILogTarget[] = [];
    private readonly _activeLoggerNames: string[] = [];

    constructor(context: string, logLevel: LogLevel, defaultLoggers?: ILogTarget[]) {
        this._context = context;
        this._logLevel = logLevel;
        if (defaultLoggers) {
            this._activeLoggers = defaultLoggers;
            this._activeLoggers.forEach(l => {
               this._activeLoggerNames.push(l.getName());
            });
        }
    }

    public addLogTarget(logTarget: ILogTarget): void {
        this._activeLoggers.push(logTarget);
        this._activeLoggerNames.push(logTarget.getName());
    }

    public log(logLevel: LogLevel, message: any, ...params: any[]): void {
        this._activeLoggers.forEach((logTarget) => {
            this.write(
                (level, message1) => {
                    logTarget.log(level, message1);
                },
                logLevel,
                message,
                ...params
            );
        });
    }

    public async logAsync(logLevel: LogLevel, message: any, ...params: any[]): Promise<void> {
        for (const logTarget of this._activeLoggers) {
            this.write(
                async (level, message1) => {
                    await logTarget.logAsync(level, message1);
                },
                logLevel,
                message,
                ...params
            );
        }
    }

    private buildMessage(level: LogLevel, message: any) {
        const now = new Date();
        return `${this.decodeLogLevel(level)} - ${this.Context} - ${now.toUTCString()} - ${message.toString()}`;
    }

    private write(func: LoggerWriteFunc, level: LogLevel, message: any, ...params: any[]): void {
        if (level >= this.LogLevel) {
            const msg = this.buildMessage(level, message);
            func(level, msg);

            if (params[0] && params[0].length === 0) return;

            params.forEach((item) => {
                func(level, item);
            });
        }
    }

    private decodeLogLevel(level: LogLevel): string {
        switch (+level) {
            case LogLevel.Debug:
                return "DEBUG";
            case LogLevel.Info:
                return "INFO";
            case LogLevel.Warning:
                return "WARNING";
            case LogLevel.Error:
                return "ERROR";
            case LogLevel.Critical:
                return "CRITICAL";
            default:
                return "";
        }
    }

    public logCritical(message: any, ...params: any[]): void {
        this.log(LogLevel.Critical, message, ...params);
    }

    public logDebug(message: any, ...params: any[]): void {
        this.log(LogLevel.Debug, message, ...params);
    }

    public logError(message: any, ...params: any[]): void {
        this.log(LogLevel.Error, message, ...params);
    }

    public logInfo(message: any, ...params: any[]): void {
        this.log(LogLevel.Info, message, ...params);
    }

    public logWarning(message: any, ...params: any[]): void {
        this.log(LogLevel.Warning, message, ...params);
    }
}
