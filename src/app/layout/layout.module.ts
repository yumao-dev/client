import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ShareModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatListModule,
    MatToolbarModule,
    MatGridListModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonToggleModule,
  ],
  declarations: [HeaderComponent, AdminComponent, AdminComponent],
  exports: [HeaderComponent, AdminComponent],
})
export class YanyuLayoutModule {}
