import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BindComponent } from './bind/bind.component';
import { UserinfoComponent } from './userinfo/userinfo.component';

const routes: Routes = [
  {
    path: '',
    component: UserinfoComponent,
    data: { title: '用户信息' },
    // canActivate: [AuthGuard],
    // outlet: 'authout'
  },
  {
    path: 'bind',
    component: BindComponent,
    data: { title: '绑定账号' },
    // canActivate: [AuthGuard],
    // outlet: 'authout'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInfoRoutingModule {}
