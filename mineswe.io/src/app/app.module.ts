import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AppInitializer } from "./shared/app-initializer";
import { interceptors } from "./app.interceptors";
import { ENVIRONMENT } from "./services/environment.service";
import { environment } from "../environments/environment";
import { LogFactoryService } from "./services/log-factory.service";
import { LocalStorageService } from "./services/local-storage.service";
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { FormsModule } from "@angular/forms";
import { GameComponent } from './components/game/game.component';

@NgModule({
	declarations: [AppComponent, SignInFormComponent, GameComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule
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
