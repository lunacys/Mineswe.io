import {APP_INITIALIZER} from '@angular/core';
import {AppConfig} from './app-config';


export function initializeApp(appConfig: AppConfig) {
    return async () => {
        await appConfig.load();
    };
}

export const AppInitializer = {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [AppConfig], multi: true
};

