import { IEnvironment } from "./environment-interface";

export const environment: IEnvironment = {
    production: false,
    name: "dev",
    isDebug: true,
    apiUrl: "https://localhost:44328/api"
};

import "zone.js/plugins/zone-error";
