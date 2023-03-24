import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  retry,
  skipUntil,
  tap,
} from 'rxjs/operators';
import { AlertsService } from './alerts.service';
import { Result } from './base-http.service';
import { ConfigService, IConfig } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private subject = new Subject<LogEntity>();
  private config = {} as IConfig;
  constructor(
    private http: HttpClient,
    private alertsservice: AlertsService,
    private configservice: ConfigService
  ) {
    this.subject
      .pipe(
        skipUntil(
          this.configservice.RemoteConfig.pipe(tap((c) => (this.config = c)))
        ),
        concatMap((info) => {
          return this.HttpLog(this.config.logurl, info);
        })
      )
      .subscribe({
        next: (r) => {
          console.trace('上传日志到服务器', r);
        },
        error: (err) => {
          console.error('上传日志到服务器失败', err.message);
        },
        complete: () => {
          console.error(
            '上传日志到服务器完成',
            '这句话永远不会出现，如果出现了那么就bug了'
          );
        },
      });
  }

  public Write(
    type: keyof typeof LogLevel,
    msg: Error | string,
    title?: string,
    tohttp: boolean = false,
    showalert: boolean = true
  ): void {
    let message = msg as string;
    if (msg instanceof Error)
      message = isDevMode() ? msg.stack || msg.message : msg.message;
    if (msg instanceof HttpErrorResponse)
      message = isDevMode() ? msg.message : msg.error;
    this.log(type, message!, title || '标题', tohttp, showalert);
  }

  private log(
    type: keyof typeof LogLevel,
    msg: string,
    thistitle: string,
    tohttp: boolean = true,
    showalert: boolean = true
  ): void {
    if (showalert) {
      let t: `success` | `info` | `warning` | `danger` = 'info';
      switch (type) {
        case 'Error': {
          t = 'danger';
          break;
        }
        case 'Warring': {
          t = 'warning';
          break;
        }
        case 'INFO': {
          t = 'info';
          break;
        }
        case 'Trace': {
          t = 'success';
          break;
        }
        default:
          break;
      }
      this.alertsservice.add(t, msg, type === 'Error' ? undefined : 3);
    }
    // http tohttp:本地判断是否需要上传到服务器
    // 排除掉记录日志的请求
    if (
      tohttp &&
      this.config.ishttplog &&
      this.config.logurl &&
      !msg.includes(this.config.logurl)
    ) {
      this.subject.next({
        app: this.config.appname,
        title: thistitle,
        message: msg,
        logtype: type,
        // clientip: '',
        // serverip: ''
      });
    }
    if (this.config.isconsole) {
      console.log(thistitle, msg);
    }
  }

  private HttpLog(url: string, msg: LogEntity): Observable<boolean> {
    return this.http.post<Result<boolean>>(url, msg).pipe(
      retry(3),
      map((obj) => obj && obj.Result),
      catchError((err, c) => {
        console.log(err);
        return of(false);
      })
    );
  }

  public getErrorMsg(control: AbstractControl): string | null {
    // this.form.get('name').errors
    let msg: string | null = null;

    for (const key in control.errors) {
      if (control.errors.hasOwnProperty(key)) {
        const element = control.errors[key];
        if (element) {
          if (typeof element === 'string') {
            msg = element;
          } else {
            switch (key) {
              case 'required':
                msg = '必填项';
                break;
              case 'maxlength':
                msg = '超过最大长度';
                break;
              case 'minlength':
                msg = '小于最小长度';
                break;
              case 'captcha':
                msg = '验证码发送失败';
                break;
              case 'notfound':
                msg = '账号不存在';
                break;
              case 'pattern':
                msg = '不符合规则';
                break;
              case 'email':
                msg = '不是邮箱';
                break;
              case 'service':
                msg = typeof element === 'string' ? element : '服务错误';
                break;
              default:
                msg = typeof element === 'string' ? element : '异常错误';
                break;
            }
          }
        }
        if (msg) {
          return msg;
        }
      }
    }

    return msg;
  }
}

export interface LogEntity {
  title: string;
  message: string;
  app: string;
  time?: string;
  logtype: keyof typeof LogLevel;
  clientip?: string;
  serverip?: string;
}

export enum LogLevel {
  'Trace',
  'INFO',
  'Warring',
  'Error',
}

// export class BaseError implements Error {
//     name: string;
//     message: string;
//     stack?: string;
//     constructor(msg: string) {
//         Error.captureStackTrace(this, this.constructor);
//         this.name = 'name';
//         this.message = msg;
//     }
// }
