import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { ConfigService } from 'src/app/share/service/config.service';
import { LogService } from 'src/app/share/service/log.service';
import { GrantService } from './grant.service';
import { Platform } from './unionuser.service';

export const AppResolver: ResolveFn<string | null> = (
  route: ActivatedRouteSnapshot
) => {
  const grantService = inject(GrantService);
  const configService = inject(ConfigService);
  const log = inject(LogService);

  return configService.RemoteConfig.pipe(
    map((c) => route.queryParamMap.get(c.appidname)),
    concatMap((appid) => {
      return grantService.GetApp(appid);
    }),
    map((app) => app.domainid),
    catchError((err) => {
      log.Write('Error', err, undefined, false, true);
      return of(null);
    })
  );
};

export const BindResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  let authcode = route.queryParamMap.get('auth_code');
  if (!authcode) {
    router.navigate(['/error'], {
      queryParams: { msg: '授权登录码不存在' },
      skipLocationChange: true,
    });
    return '';
  } else {
    return authcode;
  }
};

export const SourceResolver: ResolveFn<keyof typeof Platform | undefined> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  let source = route.queryParamMap.get('source');
  if (source === 'alipay' || source === 'wechat') {
    return source as keyof typeof Platform;
  } else {
    router.navigate(['/error'], {
      queryParams: { msg: `不知道的loginsource:${source}` },
      skipLocationChange: true,
    });
    return undefined;
  }
};

export const AppGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const grantService = inject(GrantService);

  let appid = route.queryParamMap.get('appid');

  return grantService.GetApp(appid).pipe(
    map((a) => {
      return Boolean(a);
    }),
    catchError((err) => {
      let msg =
        err instanceof HttpErrorResponse ? err.error : err?.message || err;
      // let tree = router.parseUrl('error?msg=appid参数不能为空');
      let tree = router.createUrlTree(['error'], {
        queryParams: { msg: msg },
        queryParamsHandling: 'merge',
      });

      return of(tree);
    })
  );
};
