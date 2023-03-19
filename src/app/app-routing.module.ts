import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './layout/content/content.component';
import { AppGuard } from './oauth/service/app.resolver';
import { AuthGuard } from './share/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
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
      {
        path: 'oauth',
        canActivateChild: [AppGuard],
        loadChildren: () =>
          import('./oauth/oauth.module').then((mod) => mod.OauthModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
