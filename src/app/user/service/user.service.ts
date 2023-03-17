import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IJWTUser } from 'src/app/share/service/auth.service';
import { BaseHttpService } from 'src/app/share/service/base-http.service';
import { LocalStorageService } from 'src/app/share/service/localstorage.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseHttpService {
  // public refrsh = new Subject<UpdateCache>();
  // private $level = new AsyncSubject<string[]>();

  constructor(
    http: HttpClient,
    protected localstorage: LocalStorageService // private authservice: AuthService
  ) {
    super(http);

    // // 初始化等级
    // this.GetDataHttp<string[]>('GET', '/api/log/levels')
    //   .subscribe(this.$level);
  }

  // public get Levels(): Observable<string[]> {
  //   return this.$level.asObservable();
  // }

  public getCapthchaCode(mobile: string, source: number) {
    return super.GetDataHttp<boolean>(
      'GET',
      `https://yumao.tech/captcha/api/new/${mobile}/${source}`
    );
  }

  public SendCapthcha(type: 'phone' | 'email', t: CaptchaType) {
    return super.GetDataHttp<boolean>(
      'GET',
      `https://yumao.tech/user/api/captcha/${type}/${t}`
    );
  }

  public register(
    param: {
      name: string;
      password: string;
      captchavalue: string;
    },
    type: 'phone' | 'email',
    source?: string,
    mark?: string
  ): Observable<boolean> {
    let url = new URL(`https://yumao.tech/user/api/account/signup/${type}`);
    if (source) url.searchParams.append('source', source);
    if (mark) url.searchParams.append('mark', mark);
    return super.GetDataHttp<boolean>('POST', url.href, {
      name: param.name,
      password: param.password,
      captcha: {
        code: param.name,
        value: param.captchavalue,
      },
    });
    // return of(true);
  }

  // public phoneregister(
  //   param: {
  //     mobile: string;
  //     captchavalue: string;
  //   },
  //   type: 'phone' | 'email',
  //   source?: string,
  //   mark?: string
  // ): Observable<boolean> {
  //   let url = new URL('https://yumao.tech/user/api/account/signup/phone');
  //   if (source) url.searchParams.append('source', source);
  //   if (mark) url.searchParams.append('mark', mark);
  //   return super.GetDataHttp<boolean>('POST', url.href, {
  //     name: param.mobile,
  //     captcha: {
  //       code: param.mobile,
  //       value: param.captchavalue,
  //     },
  //   });
  // }
  public containsName(name: string): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'GET',
      `https://yumao.tech/user/api/account/contains/${name}`
    );
  }
  public getPasswordToken(name: string) {
    return super.GetDataHttp<boolean>(
      'GET',
      `https://yumao.tech/user/api/account/password/${name}`
    );
  }

  public getOptMethods() {
    return super.GetDataHttp<Array<{ key: string; value: string }>>(
      'GET',
      `https://yumao.tech/user/api/password/method`
    );
  }

  public passwordByIDcard(param: {
    idcard: string;
    password: string;
  }): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'POST',
      `https://yumao.tech/user/api/password/idcard/${param.password}`,
      param
    );
  }

  public NewPasswordByCaptcha(
    password: string,
    captcha: { code: string; value: string },
    t: 'email' | 'phone'
  ): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'POST',
      `https://yumao.tech/user/api/password/${t}`,
      {
        password: password,
        captcha: captcha,
      }
    );
  }

  public setNickName(nickname: string): Observable<boolean> {
    // return of(true);
    return super.GetDataHttp<boolean>(
      'PUT',
      `https://yumao.tech/user/api/users/setnickname/${nickname}`
    );
  }
  // public hasIDcard(): Observable<boolean> {
  //   return super.GetDataHttp<boolean>(
  //     'GET',
  //     `https://yumao.tech/user/api/idcard`
  //   );
  // }
  public setIDcard(idcard: string): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'POST',
      `https://yumao.tech/user/api/users/idcard`,
      { idcard }
    );
  }
  public newEmailOrPhone(
    key: string,
    type: 'phone' | 'email'
  ): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'POST',
      `https://yumao.tech/user/api/users/${type}`,
      { key }
    );
  }
  public setEmailOrPhone(
    key: string,
    type: 'phone' | 'email',
    code: string
  ): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'PUT',
      `https://yumao.tech/user/api/users/${type}`,
      {
        key,
        captcha: { value: code },
      }
    );
  }

  public Bind(entity: { name: string; password: string }): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'POST',
      `https://yumao.tech/user/api/users/bind`,
      entity
    );
  }

  public getUserInfo(): Observable<IUserEntity> {
    return super.GetDataHttp<IUserEntity>(
      'GET',
      `https://yumao.tech/user/api/users/userinfo`
    );
  }
  public LoginLogs(): Observable<ILoginLog[]> {
    // return Promise.resolve<Result<boolean>>(<Result<boolean>>{Data:true,Error:null})
    return super
      .GetDataHttp<ILoginLog[]>(
        'GET',
        `https://yumao.tech/user/api/users/loginlog`
      )
      .pipe(
        catchError((err) => {
          return of([]);
        })
      );
  }
}

export interface IUserinfo {
  nickname: string;
  ip: string;
  time: number;
  lastip: string;
  lasttime: number;
  hasidcard: boolean;
}

export interface IUserEntity {
  userid: number;
  code: string;
  enabled: Boolean;
  email?: string;
  phone?: string;
  usergroup: number[];
  nickname?: string;
  address?: string;
  idcard?: string;
  description?: string;
}

export interface I1UserEntity extends IJWTUser, IUserEntity {
  nickname: string;
}

export interface ILoginLog {
  id: number;
  code: string;
  app: string;
  ip: string;
  indate: Date;
}
export enum CaptchaType {
  login = 1,
  reg = 2,
  getpwd = 3,
  setname = 4,
  other = 10,
}
