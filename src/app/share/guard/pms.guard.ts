import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { concatMap, tap } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { PermissionService } from '../service/permission.service';

export const PmsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const service = inject(PermissionService);
  const configservice = inject(ConfigService);
  const router = inject(Router);

  return configservice.RemoteConfig.pipe(
    concatMap((c) => service.checkStatus(c.appname)),
    tap((result) => {
      if (!result) {
        //读取当前路由中的参数
        router.navigate(['/error'], {
          queryParams: { msg: '没有权限，请联系权限管理人员' },
          queryParamsHandling: 'preserve',
        });
      }
    })
  );
};
