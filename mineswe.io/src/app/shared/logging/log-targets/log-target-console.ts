import { ILogTarget } from "../log-target-interface";
import { LogLevel } from "../log-level";

export class LogTargetConsole implements ILogTarget {
    public getName(): string {
        return "Console";
    }

    public log(level: LogLevel, message: any): void {
        switch (+level) {
            case LogLevel.Critical:
            case LogLevel.Error:
                console.error(message);
                break;
            case LogLevel.Warning:
                console.warn(message);
                break;
            default:
                console.log(message);
                break;
        }
    }

    public logAsync(level: LogLevel, message: any): Promise<void> {
        return new Promise((resolve) => {
            switch (+level) {
                case LogLevel.Critical:
                case LogLevel.Error:
                    console.error(message);
                    break;
                case LogLevel.Warning:
                    console.warn(message);
                    break;
                default:
                    console.log(message);
                    break;
            }

            resolve();
        });
    }
}
