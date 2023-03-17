import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ShareModule } from '../share/share.module';
import { IndexComponent } from './index/index.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ShareModule,
    MatCardModule,
    MatListModule,
  ],
})
export class UserModule {}
