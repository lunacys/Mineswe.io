import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./components/app.component";

const routes: Routes = [
    //{ path: "", component: AppComponent }
    {path: "swagger", redirectTo: "swagger/index.html"},
    {path: "swagger/index.html", redirectTo: "swagger/index.html"}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
