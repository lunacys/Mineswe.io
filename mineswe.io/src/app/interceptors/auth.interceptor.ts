import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvironmentService } from "../services/environment.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private environmentService: EnvironmentService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isAuthCall = request.url === this.environmentService.getValue("apiUrl") + "/auth";

        if (isAuthCall) {
            request = request.clone({
                withCredentials: true
            });
        }

        return next.handle(request);
    }
}
