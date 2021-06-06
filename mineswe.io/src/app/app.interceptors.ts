import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Provider } from "@angular/core";
import { TimeoutInterceptor } from "./interceptors/timeout.interceptor";
import { RetryInterceptor } from "./interceptors/retry.interceptor";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";

export const interceptors: Provider[] = [
    { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }
];
