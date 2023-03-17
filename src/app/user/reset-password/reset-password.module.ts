import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { ShareModule } from 'src/app/share/share.module';
import { PasswordComponent } from './password/password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  declarations: [PasswordComponent],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatRadioModule,
  ],
})
export class ResetPasswordModule {}
