import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { concatMap, filter, finalize, tap } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { LogService } from '../service/log.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let started = Date.now();
    let ok: boolean = false;

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
          tap({
            next: (event) => (ok = event instanceof HttpResponse && event.ok),
            error: (error) => (ok = false),
          }),
          finalize(() => {
            if (ok) {
              let elapsed = Date.now() - started;
              let msg = `${req.method}\t"${req.urlWithParams}"\t${
                ok ? 'successed' : 'failed'
              }\tin\t${elapsed}\tms`;
              logservice.Write('INFO', msg, '网络访问情况');
            }
          })
        );
      })
    );
  }
}
