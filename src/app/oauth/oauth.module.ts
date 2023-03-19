import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BindComponent } from './bind/bind.component';
import { GrantComponent } from './grant/grant.component';
import { LoginComponent } from './login/login.component';
import { OauthRoutingModule } from './oauth-routing.module';

@NgModule({
  declarations: [BindComponent, LoginComponent, GrantComponent],
  imports: [CommonModule, OauthRoutingModule],
})
export class OauthModule {}
