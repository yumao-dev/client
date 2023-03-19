import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService extends BaseHttpService {
  public static get appkey() {
    if (isDevMode()) {
      return 'UF9pfztSNZU6GDWzti67y3b2F';
    }
    return 'yE6wNhJaz54uZFtF8bK5oOXJi';
  }

  public static remoteconfig =
    'https://service.yumao.tech/config/api/startconfig';
  public RemoteConfig = new AsyncSubject<IConfig>();

  // // 是否整个站点都需要登录
  // public globalauth = true;

  public static isRemoteConfigUrl(url: string): boolean {
    return url.startsWith(ConfigService.remoteconfig);
  }

  constructor(http: HttpClient) {
    super(http);
    super
      .GetDataHttp<IConfig>(
        'GET',
        `${ConfigService.remoteconfig}/${ConfigService.appkey}`
      )
      .pipe(
        map((result) => {
          let url = new URL(result.oauthurl);
          url.searchParams.set(result.appidname, result.appkey);
          return {
            ...result,
            remoteconfig: ConfigService.remoteconfig,
            oauthurl: url.toString(),
          };
        })
      )
      .subscribe(this.RemoteConfig);
  }
}

export interface IConfig {
  appname: string;
  appkey: string;
  oauthurl: string;
  oauthcodename: string;
  appidname: string;
  oauthstatename: string;
  redirecturlname: string;
  tokenname: string; // 本地存储的tokenname
  httptokenname: string; // 请求时header内的tokanname
  logurl: string;
  ishttplog: boolean;
  isconsole: boolean;
  // 本地化参数，非配置参数
  remoteconfig: string;
  [k: string]: any;
}
