import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShareModule } from '../share/share.module';

import { BindComponent } from './bind/bind.component';
import { GrantComponent } from './grant/grant.component';
import { LoginComponent } from './login/login.component';
import { OauthRoutingModule } from './oauth-routing.module';

@NgModule({
  declarations: [BindComponent, LoginComponent, GrantComponent],
  imports: [
    CommonModule,
    OauthRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
})
export class OauthModule {}
