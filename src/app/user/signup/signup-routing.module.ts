import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailComponent } from './email/email.component';
import { PhoneComponent } from './phone/phone.component';

const routes: Routes = [
  {
    path: 'phone',
    component: PhoneComponent,
    data: { title: '快速注册' },
    // outlet: 'authout'
  },
  {
    path: 'email',
    component: EmailComponent,
    data: { title: '邮箱注册' },
    // outlet: 'authout'
  },
  {
    path: '',
    redirectTo: 'email',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpRoutingModule {}
