import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { AuthService, IJWTUser } from 'src/app/share/service/auth.service';
import { ConfigService, IConfig } from 'src/app/share/service/config.service';
import { LocalStorageService } from 'src/app/share/service/localstorage.service';
import { LogService } from 'src/app/share/service/log.service';
import { Platform, UnionUserService } from '../service/unionuser.service';

@Component({
  selector: 'app-bind',
  templateUrl: './bind.component.html',
  styleUrls: ['./bind.component.scss'],
})
export class BindComponent implements OnInit {
  isbind = true;
  data: Observable<{
    code: string;
    appid: string;
    source: keyof typeof Platform | undefined;
  }>;
  currentUser: Observable<IJWTUser | undefined>;
  params: Params = {};
  constructor(
    private route: ActivatedRoute,
    private service: UnionUserService,
    protected localstorage: LocalStorageService,
    private config: ConfigService,
    private log: LogService,
    public authservice: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authservice.usersubject;
    this.data = this.route.data.pipe(
      take(1),
      map((data) => {
        return data as unknown as {
          code: string;
          appid: string;
          source: keyof typeof Platform | undefined;
        };
      })
    );
  }

  ngOnInit(): void {
    //读取loginsource
    //判断是否已经绑定
    this.data
      .pipe(
        concatMap((d) => {
          return this.service.GetUser(d);
        }),
        concatMap((token) => {
          if (token) {
            return this.config.RemoteConfig.pipe(
              map((config) => {
                if (token) {
                  this.localstorage.setItem(config.tokenname, token);
                }
                return Boolean(token);
              })
            );
          } else {
            return of(false);
          }
        }),
        tap((a) => {
          this.isbind = a;
        })
      )
      .subscribe(
        (v) => {
          if (v) {
            this.router.navigate(['grant'], {
              queryParams: this.params,
            });
          }
        },
        (err) => {
          this.log.Write('Error', err);
        }
      );

    //
    this.config.RemoteConfig.pipe(
      map((c) => {
        return [c, this.route.snapshot.queryParamMap] as [IConfig, ParamMap];
      })
    ).subscribe({
      next: ([config, paramMap]) => {
        this.params[config.redirecturlname] = paramMap.get(
          config.redirecturlname
        );
        this.params['appid'] = paramMap.get('appid');
        this.params['state'] = paramMap.get('state');
      },
      error: (err) => {
        this.log.Write('Error', err);
      },
    });
  }

  bind = () => {
    this.data
      .pipe(
        concatMap((d) => this.service.Bind(d)),
        concatMap((token) => {
          if (token) {
            return this.config.RemoteConfig.pipe(
              map((config) => {
                if (token) {
                  this.localstorage.setItem(config.tokenname, token);
                }
                return Boolean(token);
              })
            );
          } else {
            return throwError(new Error('账号绑定失败'));
          }
        })
      )
      .subscribe({
        next: (v) => {
          this.router.navigate(['/grant'], {
            queryParams: this.params,
          });
        },
        error: (err) => {
          // let msg =
          //   err instanceof HttpErrorResponse ? err.error : err?.message || err;
          // this.log.debug(msg);
          this.log.Write('Error', err);
        },
      });
  };
}
