import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvironmentService } from "../services/environment.service";

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
    constructor(private environmentService: EnvironmentService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!request.url.startsWith("assets")) {
            request = request.clone({
               url: this.environmentService.getValue("apiUrl") + request.url
            });
        }

        return next.handle(request);
    }
}
