import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ShareModule } from 'src/app/share/share.module';
import { BindComponent } from './bind/bind.component';
import { EmailComponent } from './email/email.component';
import { IdcardComponent } from './idcard/idcard.component';
import { NicknameComponent } from './nickname/nickname.component';
import { PhoneComponent } from './phone/phone.component';
import { UserInfoRoutingModule } from './user-info-routing.module';
import { UserinfoComponent } from './userinfo/userinfo.component';

@NgModule({
  declarations: [
    IdcardComponent,
    NicknameComponent,
    UserinfoComponent,
    PhoneComponent,
    EmailComponent,
    BindComponent,
  ],
  imports: [
    CommonModule,
    UserInfoRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatTableModule,
  ],
})
export class UserInfoModule {}
