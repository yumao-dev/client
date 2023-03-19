import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorComponent } from './error/error.component';
// import {
//   MatAutocompleteModule,
//   MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
// } from '@angular/material/autocomplete';
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatButtonModule } from '@angular/material/button';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatExpansionModule } from '@angular/material/expansion';
// import {
//   MatFormFieldModule,
//   MAT_FORM_FIELD_DEFAULT_OPTIONS,
// } from '@angular/material/form-field';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatTreeModule } from '@angular/material/tree';
// import { AlertModalComponent } from './alert-modal/alert-modal.component';
// import { AlertsComponent } from './alerts/alerts.component';
import { AuthHttpInterceptor } from './interceptor/auth.httpinterceptor';
import { ErrorHttpInterceptor } from './interceptor/error.httpinterceptor';
import { LoggingInterceptor } from './interceptor/log.httpinterceptor';
import { ParamHttpInterceptor } from './interceptor/param.httpinterceptor';
import { FilterPipe, GetPipe } from './pipe/filter.pipe';
import { AlertsService } from './service/alerts.service';
import { ShareRoutingModule } from './share-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ShareRoutingModule,
    MatSnackBarModule,
  ],
  declarations: [
    // AlertModalComponent,
    FilterPipe,
    GetPipe,
    ErrorComponent,
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    FilterPipe,
    GetPipe,
    MatRadioModule,
    // MatExpansionModule,
    // MatTreeModule,
    // MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule,
    // MatBadgeModule,
    // MatMenuModule,
    // MatGridListModule,
    // MatTabsModule,
    // MatButtonToggleModule,
    // MatInputModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatProgressSpinnerModule,
    // MatPaginatorModule,
    // MatTableModule,
    // MatSelectModule,
    // MatDialogModule,
    // MatAutocompleteModule,
  ],
  providers: [
    AlertsService,
    // LoginResolver,
    { provide: HTTP_INTERCEPTORS, useClass: ParamHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHttpInterceptor, multi: true },
  ],
})
export class ShareModule {
  // angular6.0 以前的写法现在直接用 @Injectable({
  //     providedIn: 'root',
  // })
  // 由于此模块不注入服务，所以在惰性模快中也不会注入两次服务， 所以这里完全不需要单例特性
  // 具体查看https://www.angular.cn/guide/singleton-services
  //  forroot 是为了方式多次实例化服务而已
  constructor(@Optional() @SkipSelf() parentModule: ShareModule) {
    // console.log('ShareModule init');
    if (parentModule) {
      return parentModule;
      // throw new Error('ShareModule is already loaded. Import it in the AppModule only');
    }
  }

  // 如果有惰性模块lazyModule导入模块ShareModule，那么会生成子注入器将LogService重新生成
  // 这时如果想将LogService变成全局唯一的，那么在lazyModule导入的时候就不要导入providers而只导入AlertsComponent
  // https://www.cnblogs.com/chen8840/p/9511264.html
  // 使用forRoot 可以保证里面的服务组件都只有一个在此处如果不使用forRoot 会导致里面的组件alerts和内部的服务AlertsService有多个这与此模块最终目标不符
  static forRoot(): ModuleWithProviders<ShareModule> {
    return {
      ngModule: ShareModule,
      providers: [
        // {
        //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        //   useValue: { floatLabel: 'auto' },
        // },
        // {
        //   provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
        //   useValue: { autoActiveFirstOption: true },
        // }, // always, never, or auto.
        // AlertsService,
        // RemoteConfigService,
      ],
    };
  }
  static forChild(): ModuleWithProviders<ShareModule> {
    return {
      ngModule: ShareModule,
    };
  }
}
