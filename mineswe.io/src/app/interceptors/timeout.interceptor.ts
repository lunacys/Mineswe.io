import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class TimeoutInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const timeoutValue = Number(request.headers.get("timeout")) || 20 * 1000; // 20 seconds
        return next.handle(request).pipe(timeout(timeoutValue));
    }
}
