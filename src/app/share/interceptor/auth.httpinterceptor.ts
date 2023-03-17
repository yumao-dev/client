import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { LocalStorageService } from '../service/localstorage.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(
    private localstorage: LocalStorageService,
    // private config: ConfigService,
    // private log: LogService,
    private injector: Injector
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // headers: {
    //     'Content-Type': data instanceof FormData ? 'application/x-www-form-urlencoded' : 'application/json', //multipart/form-data
    //     'apiKey': this.localstorage.get(this.tokenname) ? `${this.localstorage.get(this.tokenname)}` : null,
    //     //'Authorization': this.localstorage.get(this.tokenname) ? `BasicAuth ${this.localstorage.get(this.tokenname)}` : null
    // },
    // const log = this.injector.get(LogService);

    // const configservice = this.injector.get(ConfigService);
    // if (configservice.isRemoteConfigUrl(req.url)) {
    //   return next.handle(req);
    // }
    if (ConfigService.isRemoteConfigUrl(req.url)) {
      return next.handle(req);
    }
    return this.injector.get(ConfigService).RemoteConfig.pipe(
      concatMap((c) => {
        const token = this.localstorage.getItem(c.tokenname);
        if (token) {
          const header: { [name: string]: string | string[] } = {};
          header[c.httptokenname] = `Bearer ${token}`;
          req = req.clone({
            setHeaders: header,
          });
        }
        return next.handle(req).pipe(
          catchError((event: HttpErrorResponse) => {
            if (!event.ok) {
              if (event.status == 401) {
                this.localstorage.removeItem(c.tokenname);
              }
            }
            return throwError(() => event);
          })
        );
      })
    );
  }
}
