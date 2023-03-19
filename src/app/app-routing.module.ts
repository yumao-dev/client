import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './layout/content/content.component';
import { AuthGuard } from './share/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user',
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((mod) => mod.UserModule),
      },
      {
        path: 'pushmsg',
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./pushmsg/pushmsg.module').then((mod) => mod.PushMsgModule),
      },
      // {
      //   path: 'oauth',
      //   canActivateChild: [AuthGuard],
      //   loadChildren: () =>
      //     import('./oauth/oauth.module').then((mod) => mod.OauthModule),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
