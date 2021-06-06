import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Provider } from "@angular/core";
import { TimeoutInterceptor } from "./interceptors/timeout.interceptor";
import { RetryInterceptor } from "./interceptors/retry.interceptor";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ApiUrlInterceptor } from "./interceptors/api-url.interceptor";

export const interceptors: Provider[] = [
    { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }
];
