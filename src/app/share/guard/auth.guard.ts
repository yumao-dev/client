import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  CanMatchFn,
  Route,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { AuthService } from '../service/auth.service';

export const AuthMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const service = inject(AuthService);
  return service.checkStatus(segments.join('/'));
};

export const AuthGuard: CanActivateFn | CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const service = inject(AuthService);
  return service.checkStatus(state.url);
};
