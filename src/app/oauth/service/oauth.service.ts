import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, Observable, shareReplay } from 'rxjs';
import { AuthService } from 'src/app/share/service/auth.service';
import { BaseHttpService } from 'src/app/share/service/base-http.service';
import { ConfigService } from 'src/app/share/service/config.service';
import { LocalStorageService } from 'src/app/share/service/localstorage.service';

@Injectable({ providedIn: 'root' })
export class OauthService extends BaseHttpService {
  public token: Observable<string | undefined>;

  constructor(
    http: HttpClient,
    protected authservice: AuthService,
    private config: ConfigService,
    protected localstorage: LocalStorageService
  ) {
    super(http);
    this.token = config.RemoteConfig.pipe(
      concatMap((config) => localstorage.GetValue(config.tokenname)),
      shareReplay(1)
    );
  }

  signIn(data: any, appid: string) {
    return this.GetDataHttp<string>(
      'POST',
      `https://yumao.tech/user/api/index/signin/${appid}`,
      data
    ).pipe(concatMap((token) => this.authservice.signIn(token)));
  }
}
