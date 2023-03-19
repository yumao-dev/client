import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from 'src/app/share/service/base-http.service';
import { LocalStorageService } from 'src/app/share/service/localstorage.service';

@Injectable({ providedIn: 'root' })
export class UnionUserService extends BaseHttpService {
  constructor(http: HttpClient, protected localstorage: LocalStorageService) {
    super(http);
  }

  //确认授权
  GetUser(data: {
    code: string;
    appid: string;
    source: keyof typeof Platform | undefined;
  }) {
    return this.GetDataHttp<string>(
      'GET',
      `https://yumao.tech/user/api/index/user/${data.source}/${data.appid}/${data.code}`,
      {}
    );
  }

  Bind(data: {
    code: string;
    appid: string;
    source: keyof typeof Platform | undefined;
  }) {
    return this.GetDataHttp<string>(
      'GET',
      `https://yumao.tech/user/api/index/bind/${data.source}/${data.appid}/${data.code}`
    );
  }

  GetOAuthUrl() {
    return this.GetDataHttp<{ alipay: string; wechat: string }>(
      'GET',
      `https://yumao.tech/user/api/index/oauthurl`
    );
  }
}

export interface ScopeEntity {
  id: number;
  name: string;
  description: string;
}

export enum Platform {
  platform,
  alipay,
  wechat,
}
