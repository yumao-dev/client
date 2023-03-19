import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../share/guard/auth.guard';
import { BindComponent } from './bind/bind.component';
import { GrantComponent } from './grant/grant.component';
import { LoginComponent } from './login/login.component';
import {
  AppResolver,
  BindResolver,
  SourceResolver,
} from './service/app.resolver';

const routes: Routes = [
  {
    path: 'bind/:source',
    component: BindComponent,
    title: '绑定账号',
    resolve: { code: BindResolver, appid: AppResolver, source: SourceResolver },
  },
  {
    path: 'login',
    component: LoginComponent,
    title: '登录认证',
    resolve: {
      appid: AppResolver,
    },
  },
  {
    path: 'grant',
    component: GrantComponent,
    title: '授予权限',
    canActivate: [AuthGuard],
    resolve: {
      appid: AppResolver,
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OauthRoutingModule {}
