import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, throwError } from 'rxjs';
import { BaseHttpService } from 'src/app/share/service/base-http.service';
import { LocalStorageService } from 'src/app/share/service/localstorage.service';

@Injectable({ providedIn: 'root' })
export class GrantService extends BaseHttpService {
  private $scope = new AsyncSubject<Array<ScopeEntity>>();

  constructor(http: HttpClient, protected localstorage: LocalStorageService) {
    super(http);

    this.GetDataHttp<Array<ScopeEntity>>(
      'GET',
      `https://yumao.tech/user/api/users/scope`
    ).subscribe(this.$scope);
  }

  //确认授权
  SureGrant(data: {
    appid: string;
    scope: Array<{ key: number; value: boolean }>;
  }): Observable<boolean> {
    return this.GetDataHttp<boolean>(
      'POST',
      `https://yumao.tech/user/api/users/grant`,
      data
    );
  }

  //检查是否已经授权
  GetScope(): Observable<Array<ScopeEntity>> {
    return this.$scope.asObservable();
  }

  //检查appid存在与否
  GetApp(appid: string): Observable<string> {
    if (!appid) {
      return throwError(new Error('appid不能为空'));
    }
    return this.GetDataHttp<string>(
      'GET',
      `https://yumao.tech/user/api/users/app/${appid}`
    );
  }

  //检查是否已经授权
  CheckStatus(appid: string): Observable<{ status: boolean; url: string }> {
    return this.GetDataHttp<{ status: boolean; url: string }>(
      'GET',
      `https://yumao.tech/user/api/users/grant/${appid}`
    );
  }
}

export interface ScopeEntity {
  id: number;
  name: string;
  description: string;
}
