import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ShareModule } from 'src/app/share/share.module';
import { EmailComponent } from './email/email.component';
import { PhoneComponent } from './phone/phone.component';
import { SignUpRoutingModule } from './signup-routing.module';

@NgModule({
  declarations: [PhoneComponent, EmailComponent],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
})
export class SignupModule {}
