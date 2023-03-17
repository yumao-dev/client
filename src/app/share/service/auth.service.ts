import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { BaseHttpService } from './base-http.service';
import { ConfigService } from './config.service';
import { LocalStorageService } from './localstorage.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService implements OnDestroy {
  public usersubject = new ReplaySubject<IJWTUser | undefined>(1);
  //当前url的参数
  private jwthelper = new JwtHelperService();

  constructor(
    http: HttpClient,
    private router: Router,
    protected localstorage: LocalStorageService,
    private config: ConfigService,
    private log: LogService
  ) {
    super(http);
    // console.error(new Date().valueOf(), 'AuthService init');
    // this.log.success('AuthService init');
    // 监听本地存储的token变化
    config.RemoteConfig.pipe(
      concatMap((config) => localstorage.GetValue(config.tokenname)),
      map((token) => {
        if (token && !this.jwthelper.isTokenExpired(token)) {
          return this.jwthelper.decodeToken(token) as IJWTUser;
        } else {
          return undefined;
        }
      })
    ).subscribe(this.usersubject);

    // // 监听token变化没有初始值 此方法如果整个站点都需要登录那么写在此处
    // this.usersubject
    //   .pipe(
    //     skipWhile((a) => {
    //       return !Boolean(a);
    //     })
    //   )
    //   .subscribe({
    //     next: (result) => {
    //       this.signInAfter(result); // 跳转到首页或者登录
    //     },
    //     error: (err) => {
    //       this.log.error(err, `token变化 处理异常`);
    //     },
    //   });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public checkStatus(tourl: string): Observable<boolean> {
    //也许可以判断user存不存在，
    return this.usersubject.pipe(
      take(1),
      map((user) => {
        return typeof user != 'undefined';
      }),
      tap((result) => {
        if (!result) {
          //读取当前路由中的参数
          this.signInAfter(false, tourl);
        }
      })
    );
  }

  public signIn(token: string): Observable<boolean> {
    return this.config.RemoteConfig.pipe(
      map((c) => {
        if (token) {
          this.localstorage.setItem(c.tokenname, token);
        }
        return Boolean(token);
      }),
      catchError((error) => {
        this.log.Write('Error', error);
        return of(false);
      })
    );
  }

  public signOut(): Observable<boolean> {
    //  删除localtionStorge即可
    return this.config.RemoteConfig.pipe(
      map((config) => {
        this.localstorage.removeItem(config.tokenname);
        return true;
      }),
      tap((r) => {
        // 登出跳转等操作
        // location.reload();
        // this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
      })
    );
  }

  /// token变化后处理方式
  public signInAfter = (result: boolean, redirecturl?: string) => {
    this.config.RemoteConfig.pipe(
      map((c) => {
        let url = new URL(`${location.protocol}//${location.host}`);
        if (!result) {
          url = new URL(c.oauthurl);
          url.searchParams.set(
            c.oauthstatename,
            `${c.redirecturlname}=${encodeURIComponent(
              redirecturl
                ? new URL(
                    `${location.protocol}//${location.host}${redirecturl}`
                  ).toString()
                : location.href
            )}`
          );
        } else {
          let queryparams = new URL(location.href).searchParams;
          if (queryparams && queryparams.has(c.oauthstatename)) {
            const state = decodeURIComponent(
              queryparams.get(c.oauthstatename)!
            );

            const redirect = state
              .split(/[;&]/)
              .map((item) => {
                if (item.split('=').length > 1) {
                  return { key: item.split('=')[0], value: item.split('=')[1] };
                } else {
                  return { key: item, value: undefined };
                }
              })
              .find((item) => item.key === c.redirecturlname);

            if (redirect && redirect.value) {
              if (!redirect.value.includes('/auth')) {
                // 修复无限循环的bug
                url = new URL(redirect.value);
              }
            }
          } else {
            url = new URL(location.href);
          }
        }

        return url;
      }),
      tap((url) => {
        if (url.href !== location.href) {
          // this.log.debug(`跳转到：${url.href}`);
          if (url.host === location.host) {
            // this.router.navigateByUrl(this.router.parseUrl(url.href));
            this.router.navigateByUrl(url.pathname);
          } else {
            // 跳转
            location.href = url.href;
          }
        }
      })
    ).subscribe();
  };
}

export enum AccountType {
  phone = 1,
  email = 2,
  alipay = 3,
  wechat = 4,
}

export interface IBaseUser {
  name: string; //用户名
  userid: number; //userid
  code: string; //usercode 暂留
  nickname?: string; //昵称
  //   ip: string; //本次（最近）登录ip
  //   time: number; // 本次（最近）登录时间

  usergroup: number[]; //用户组
  accounttype: AccountType;
}

export interface IJWTUser extends IBaseUser {
  iss?: string; // jwt签发者
  sub?: string; //jwt所面向的用户
  aud?: string; //接收jwt的一方
  exp?: number; //jwt的过期时间，这个过期时间必须要大于签发时间
  nbf?: string; //定义在什么时间之前，该jwt都是不可用的
  iat?: number; //jwt的签发时间
  jti?: string; //jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击
}
