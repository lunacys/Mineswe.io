import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.trySend(request, next, 3);
    }

    private trySend(request: HttpRequest<unknown>, next: HttpHandler, count: number): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 0 && count > 1) {
                    console.warn("retrying..");
                    const newReq = request.clone();
                    return this.trySend(newReq, next, count - 1);
                } else {
                    return throwError(err);
                }
            })
        );
    }
}
