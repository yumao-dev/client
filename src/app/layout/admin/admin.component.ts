import { Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/share/service/auth.service';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  links = [
    { label: '注册', path: 'signup' },
    { label: '找回密码', path: 'password' },
    { label: '资料管理', path: 'userinfo' },
    { label: '绑定账号', path: 'userinfo/bind' },
  ];
  activeLink = this.links[0];
  // @Input() show: boolean;

  routeurl: { url: string; title: string }[] = [];
  app = {
    name: 'bootstrap4--angular2-Template',
    version: '1.0.0',
    // for chart colors
    color: {
      primary: '#7266ba',
      info: '#23b7e5',
      success: '#27c24c',
      warning: '#fad733',
      danger: '#f05050',
      light: '#e8eff0',
      dark: '#3a3f51',
      black: '#1c2b36',
    },
    settings: {
      themeID: 1,
      navbarHeaderColor: 'bg-black',
      navbarCollapseColor: 'bg-white-only',
      asideColor: 'bg-black',
      headerFixed: true,
      asideFixed: true,
      asideFolded: false,
      asideDock: false,
      container: false,
    },
  };

  private mobilequerylistener: () => void;

  constructor(
    private authservice: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public layoutService: LayoutService
  ) {
    this.mobileQuery = media.matchMedia(Breakpoints.Handset); // 可以判断是不是手机端
    this.mobilequerylistener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobilequerylistener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobilequerylistener);
  }

  ngOnInit() {}
}
