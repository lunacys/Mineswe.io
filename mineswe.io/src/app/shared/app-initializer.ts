import { APP_INITIALIZER } from "@angular/core";
import { AppConfig } from "./app-config";

export type InitCallback = () => void;

export function initializeApp(appConfig: AppConfig): InitCallback {
    return async () => {
        await appConfig.load();
    };
}

export const AppInitializer = {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [AppConfig],
    multi: true,
};
