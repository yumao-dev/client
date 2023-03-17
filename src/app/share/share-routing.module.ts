import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { authCodeResolver } from './resolve/auth.resolver';

const routes: Routes = [
  {
    path: 'auth',
    pathMatch: 'full',
    loadComponent: () =>
      import('./auth/auth.component').then((a) => a.AuthComponent),
    resolve: {
      authcode: authCodeResolver,
    },
  },
  {
    path: '**',
    component: ErrorComponent,
    data: { title: 'ERROR' },
  },
];

@NgModule({
  declarations: [],
  imports: [
    // CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class ShareRoutingModule {}
