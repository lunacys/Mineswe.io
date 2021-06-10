import { Injectable } from "@angular/core";
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LogFactoryService } from "../services/log-factory.service";
import { ILogger } from "../shared/logging/logger-interface";
import { tap } from "rxjs/operators";

let counter = 0;

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    private readonly _logger: ILogger;

    constructor(private logFactory: LogFactoryService) {
        this._logger = logFactory.getLogger("LoggingInterceptor");
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const id = counter++;

        this._logger.logDebug(
            `Request #${id}, Method: ${request.method}, URL: ${request.url}, withCredentials: ${request.withCredentials}`
        );

        return next.handle(request).pipe(
            tap(
                (data) => {
                    if (data instanceof HttpResponse) {
                        this._logger.logDebug(
                            `Response #${id}, URL: ${data.url}, Status: ${data.status}: ${data.statusText}, Body: `,
                            data.body
                        );
                    }
                },
                (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                        this._logger.logError(
                            `Response #${id}, URL: ${err.url}, Status: ${err.status}: ${err.statusText}, Message: ${err.message}, Error: `,
                            err.error
                        );
                    }
                }
            )
        );
    }
}
