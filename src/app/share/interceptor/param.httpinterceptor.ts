import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ParamHttpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //  const xsrftoken = sessionStorage.getItem(BaseHttpService.tokenname);
    // const authReq = req.clone({
    //   headers: req.headers.set(this.config.httptokenname, token)
    // });

    const header: { [name: string]: string | string[] } = {};

    // const all = new Map();
    // // 复制原有的header
    // for (const key in req.headers) {
    //   if (req.headers.hasOwnProperty(key)) {
    //     const element = req.headers.get(key);
    //     all.set(key, element);
    //   }
    // }
    // // 复制原有的参数
    // for (const key in req.params) {
    //   if (req.params.hasOwnProperty(key)) {
    //     const element = req.params.get(key);
    //     all.set(key, element);
    //   }
    // }

    // let str = '';
    // new Array(all.keys).sort().forEach((item) => {
    //   str += `${item}=${all.get(item)}`;
    // });
    // header.csrftoken = Md5.hashStr(str).toString();
    // let storage = document.cookie;

    let param: any = {};
    if (isDevMode()) {
      param.debug = 'true';
      header['cid'] = 'NTVRmRyBiaTmwFQhgQ2kQfRvG3XtZ7';
    }
    const tokenreq = req.clone({
      setHeaders: header,
      setParams: param,
    });
    return next.handle(tokenreq);
  }
}
