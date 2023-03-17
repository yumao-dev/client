import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../share/guard/auth.guard';
import { ContentComponent } from './content/content.component';
import { IndexComponent } from './index/index.component';
import { signupSourceResolver } from './service/user.resolver';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
        data: { title: '首页' },
      },
      {
        path: 'userinfo',
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./user-info/user-info.module').then(
            (mod) => mod.UserInfoModule
          ),
      },
      {
        path: 'password',
        loadChildren: () =>
          import('./reset-password/reset-password.module').then(
            (mod) => mod.ResetPasswordModule
          ),
      },
      {
        path: 'signup',
        loadChildren: () =>
          import('./signup/signup.module').then((mod) => mod.SignupModule),
        resolve: {
          source: signupSourceResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
