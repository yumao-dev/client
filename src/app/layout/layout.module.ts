import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';
import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ShareModule,

    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatGridListModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSidenavModule,
  ],
  declarations: [
    HeaderComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    ContentComponent,
  ],
})
export class YanyuLayoutModule {}
