import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Resolve,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { LogService } from 'src/app/share/service/log.service';
import { GrantService } from './grant.service';
import { Platform } from './unionuser.service';

@Injectable({ providedIn: 'root' })
export class AppResolver implements Resolve<string> {
  constructor(
    private router: Router // private grantService: GrantService, // private log: LogService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    // 将url上的code转为token
    return of(route.queryParamMap.get('appid')).pipe(
      map((appid) => {
        if (!appid) {
          this.router.navigate(['/error'], {
            queryParams: { msg: '请填写你要授权登录的域ID' },
            skipLocationChange: true,
          });
          return '';
        } else {
          return appid;
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class BindResolver implements Resolve<string> {
  constructor(
    private router: Router // private grantService: GrantService, // private log: LogService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    // 将url上的code转为token
    return of(route.queryParamMap.get('auth_code')).pipe(
      map((authcode) => {
        if (!authcode) {
          this.router.navigate(['/error'], {
            queryParams: { msg: '授权登录码不存在' },
            skipLocationChange: true,
          });
          return '';
        } else {
          return authcode;
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class SourceResolver
  implements Resolve<keyof typeof Platform | undefined>
{
  constructor(
    private router: Router // private grantService: GrantService, // private log: LogService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // 将url上的code转为token
    return of(route.paramMap.get('source')).pipe(
      map((source) => {
        if (source === 'alipay' || source === 'wechat') {
          return source as keyof typeof Platform;
        } else {
          this.router.navigate(['/error'], {
            queryParams: { msg: `不知道的loginsource:${source}` },
            skipLocationChange: true,
          });
          return undefined;
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class AppGuard implements CanActivate {
  constructor(protected log: LogService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return of(route.queryParamMap.has('appid')).pipe(
      concatMap((a) => {
        if (!a) {
          return throwError(new Error('appid参数不能为空'));
        } else {
          return of(true);
        }
      }),
      map((a) => Boolean(a)),
      catchError((err) => {
        this.log.error(err, err?.message, true);
        return of(false);
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class AppUserGuard extends AppGuard implements CanLoad {
  constructor(
    private grantService: GrantService,
    protected override log: LogService
  ) {
    super(log);
  }

  override canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return super.canActivate(route, state).pipe(
      concatMap((r) => {
        return this.grantService.GetApp(route.queryParamMap.get('appid')!);
      }),
      map((a) => {
        return Boolean(a);
      }),
      catchError((err) => {
        this.log.error(err, err?.message, true);
        return of(false);
      })
    );
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return of(true);
  }
}
