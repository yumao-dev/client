import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { LogService } from '../service/log.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (ConfigService.isRemoteConfigUrl(req.url)) {
      return next.handle(req);
    }
    let configservice = this.injector.get(ConfigService);
    let logservice = this.injector.get(LogService);
    return configservice.RemoteConfig.pipe(
      concatMap((c) => {
        let islog = req.url.includes(c.logurl);
        let started = Date.now();
        return next.handle(req).pipe(
          tap({
            next: (event) => {
              if (!islog && event instanceof HttpResponse && event.ok) {
                let elapsed = Date.now() - started;
                let msg = `${req.method}\t"${req.urlWithParams}"\t  successed  \tin\t${elapsed}\tms`;
                logservice.Write('INFO', msg, '网络访问情况', true);
              }
            },
            error: (event) => {
              if (!islog && event instanceof HttpErrorResponse) {
                // const err = new Error(`url:${event.url},status:${event.status},text:${event.message}`);
                // const err = new Error(event.message);
                const strerror = `status:${event.status},text:${
                  typeof event.error === 'string' ? event.error : event.message
                }`;
                logservice.Write(
                  'Error',
                  strerror,
                  `${event.url} 访问返回有误`,
                  true
                );
              }
              return throwError(() => event);
            },
          })
        );
      })
    );
  }
}
