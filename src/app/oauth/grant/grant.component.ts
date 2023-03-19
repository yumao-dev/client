import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { concatMap, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/share/service/auth.service';
import { ConfigService } from 'src/app/share/service/config.service';
import { LogService } from 'src/app/share/service/log.service';
import { GrantService, ScopeEntity } from '../service/grant.service';

@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss'],
})
export class GrantComponent implements OnInit {
  // scope 没用预取消掉
  param = new ReplaySubject<QueryParam>(1);
  GrantStatus = new ReplaySubject<GrantStatusParam>(1);
  refresh = new BehaviorSubject(true);

  scopes!: Observable<Array<ScopeEntity>>;

  form!: FormGroup;

  constructor(
    public service: GrantService,
    private log: LogService,
    private route: ActivatedRoute,
    protected authservice: AuthService,
    protected configservice: ConfigService
  ) {}

  ngOnInit() {
    this.route.queryParamMap
      .pipe(
        filter((a) => a && a.has('appid')),
        concatMap((a) => {
          return this.configservice.RemoteConfig.pipe(
            map((config) => {
              return {
                appid: a.get('appid'),
                // scope: a.get("scope") || 'base',
                state: a.get(config.oauthstatename),
                redirect: a.get(config.redirecturlname),
              } as QueryParam;
            })
          );
        }),
        concatMap((a) => {
          return this.authservice.tokenObservable.pipe(
            filter((b) => Boolean(b)),
            take(1),
            map((b) => {
              a.code = b;
              return a;
            })
          );
        })
      )
      .subscribe(this.param);

    // 检查是否授权
    this.refresh
      .pipe(
        switchMap(() => this.param),
        switchMap((a) => {
          return combineLatest([
            this.service.CheckStatus(a.appid),
            this.configservice.RemoteConfig,
          ]).pipe(
            take(1),
            tap(([b, c]) => {
              //如果已经授权直接跳转
              if (b.status) {
                let url = new URL(b.url);
                if (a.code) url.searchParams.append(c.oauthcodename, a.code);
                if (a.state) url.searchParams.append(c.oauthstatename, a.state);
                location.href = url.href;
              }
            }),
            map(([b, c]) => {
              return { ...b, ...a } as GrantStatusParam;
            })
          );
        })
      )
      .subscribe(this.GrantStatus);

    // 如果还没授权过才去获取所有的域并要求授权
    this.scopes = this.GrantStatus.pipe(
      filter((a) => !a.status),
      take(1),
      concatMap((params) => {
        return this.service.GetScope().pipe(
          tap((scopes) => {
            let scopeformgrop = new FormGroup({});
            scopes.forEach((scope) => {
              scopeformgrop.addControl(
                scope.id.toString(),
                new FormControl({
                  value: scope.name == 'base',
                  disabled: scope.name == 'base',
                })
              );
              // scopeformgrop.addControl(scope.id.toString(), new FormControl(scope.name == 'base'));
            });
            this.form = new FormGroup({
              appid: new FormControl(params.appid),
              scopes: scopeformgrop,
            });
          })
        );
      })
    );
  }
  //查验是否已经授权，如果已经授权跳转到redircturl，如果不是显示用户确认授权

  sure() {
    let p = { ...this.form.value };
    p.scopes = [];
    for (const key in this.form.value.scopes) {
      if (this.form.value.scopes.hasOwnProperty(key)) {
        p.scopes.push({ key: key, value: this.form.value.scopes[key] });
      }
    }
    this.service.SureGrant(p).subscribe(
      (result) => {
        if (!result) {
          this.log.debug('授权失败，需要重试', '用户授权异常');
        } else {
          this.refresh.next(true);
        }
      },
      (err) => {
        let msg =
          err instanceof HttpErrorResponse ? err.error : err?.message || err;
        this.log.error(msg, '用户授权异常', true);
      }
    );
  }
}

interface QueryParam {
  appid: string;
  // scope: string;
  state?: string;
  code?: string;
  redirect?: string;
}

interface GrantStatusParam extends QueryParam {
  code: string;
  status: boolean;
  url: string;
}
interface GrantStatusScopeParam {
  scope: Array<ScopeEntity>;
  param: GrantStatusParam;
}
