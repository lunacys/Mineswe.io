import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { AppConfig } from "../shared/app-config";
import { EnvironmentService } from "../services/environment.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private environmentService: EnvironmentService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        const isApiCall = request.url.startsWith(this.environmentService.getValue("apiUrl"));

        if (
            isApiCall &&
            this.authService.isSignedIn &&
            this.authService.token !== null
        ) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.token}`
                },
                withCredentials: true
            });
        }

        return next.handle(request);
    }
}
