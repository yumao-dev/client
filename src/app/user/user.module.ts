import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ShareModule } from '../share/share.module';
import { ContentComponent } from './content/content.component';
import { IndexComponent } from './index/index.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [IndexComponent, ContentComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ShareModule,
    MatCardModule,
    MatListModule,
    MatTabsModule,
  ],
})
export class UserModule {}
