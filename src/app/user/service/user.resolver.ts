import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/share/service/config.service';

export const signupSourceResolver: ResolveFn<string | null> = (
  route: ActivatedRouteSnapshot
) => {
  const configservice = inject(ConfigService);
  return configservice.RemoteConfig.pipe(
    map((config) => {
      return route.queryParamMap.get(config['signinsource']);
    })
  );
};
