import { Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, IJWTUser } from 'src/app/share/service/auth.service';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {
  user!: Observable<IJWTUser | undefined>;
  mobileQuery: MediaQueryList;

  @Input()
  show!: boolean;

  // routeurl: { url: string; title: string }[] = [];
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

  // private _mobileQueryListener: () => void;

  constructor(
    private authservice: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public layoutService: LayoutService
  ) {
    this.mobileQuery = media.matchMedia(Breakpoints.Handset); // 可以判断是不是手机端
    // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.user = this.authservice.usersubject;
  }

  ngOnDestroy(): void {
    // this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {}

  leftSideNavChange = (show: boolean) => {
    this.layoutService.showLeftaside = show;
  };
  rightSideNavChange = (show: boolean) => {
    this.layoutService.showRightaside = show;
  };
}
