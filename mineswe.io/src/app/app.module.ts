import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AppInitializer } from "./shared/app-initializer";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule
	],
	providers: [HttpClient, AppInitializer],
	bootstrap: [AppComponent]
})
export class AppModule { }
