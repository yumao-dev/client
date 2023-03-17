import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, filter } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { LogService } from '../service/log.service';

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (ConfigService.isRemoteConfigUrl(req.url)) {
      return next.handle(req);
    }
    let configservice = this.injector.get(ConfigService);
    let logservice = this.injector.get(LogService);

    return configservice.RemoteConfig.pipe(
      filter((c) => {
        return !req.url.includes(c.logurl);
      }),
      concatMap((c) => {
        return next.handle(req).pipe(
          catchError((event: HttpErrorResponse) => {
            if (!event.ok) {
              // const err = new Error(`url:${event.url},status:${event.status},text:${event.message}`);
              // const err = new Error(event.message);
              const strerror = `status:${event.status},text:${
                typeof event.error === 'string' ? event.error : event.message
              }`;
              logservice.Write('Error', strerror, `${event.url} 访问返回有误`);
            }
            return throwError(() => event);
          })
        );
      })
    );
  }
}
