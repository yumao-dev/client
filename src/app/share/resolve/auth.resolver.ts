import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';

export const authCodeResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const configservice = inject(ConfigService);
  // const code = route.paramMap.get('id')!;
  return configservice.RemoteConfig.pipe(
    concatMap((config) => {
      let code = route.queryParamMap.get(config.oauthcodename);
      if (code) {
        return of(code);
      } else {
        router.navigate(['/error'], {
          queryParams: { msg: '认证码为空' },
          skipLocationChange: true,
        });
        return EMPTY;
      }
    })
  );
};
