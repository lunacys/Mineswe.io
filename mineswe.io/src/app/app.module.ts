import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AppInitializer } from "./shared/app-initializer";
import { interceptors } from "./app.interceptors";
import { ENVIRONMENT } from "./services/environment.service";
import { environment } from "../environments/environment";
import { LogFactoryService } from "./services/log-factory.service";
import { LocalStorageService } from "./services/local-storage.service";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule
	],
	providers: [
	    HttpClient,
        LogFactoryService,
        LocalStorageService,
        AppInitializer,
        interceptors,
        {
            provide: LOCALE_ID,
            useValue: "en"
        },
        {
            provide: ENVIRONMENT,
            useValue: environment
        }
    ],
	bootstrap: [AppComponent]
})
export class AppModule { }
