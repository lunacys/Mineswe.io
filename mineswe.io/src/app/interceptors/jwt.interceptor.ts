import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { EMPTY, NEVER, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { AppConfig } from "../shared/app-config";
import { EnvironmentService } from "../services/environment.service";
import { tap } from "rxjs/operators";
import { LogFactoryService } from "../services/log-factory.service";
import { ILogger } from "../shared/logging/logger-interface";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private readonly _logger: ILogger;

    constructor(
        private authService: AuthService,
        private environmentService: EnvironmentService,
        private logFactory: LogFactoryService
    ) {
        this._logger = logFactory.getLogger("JwtInterceptor");
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isApiCall = request.url.startsWith(this.environmentService.getValue("apiUrl"));

        if (isApiCall) {
            if (this.authService.isSignedIn && this.authService.token !== null) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${this.authService.token}`
                    },
                    withCredentials: true
                });
            } else {
                // Deny from sending to prevent errors
                // return NEVER;
            }
        }

        return next.handle(request).pipe(
            tap(
                () => {},
                (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status !== 401) {
                            return;
                        }

                        this._logger.logError("Unauthorized");
                        this.authService.signOut();
                    }
                }
            )
        );
    }
}
