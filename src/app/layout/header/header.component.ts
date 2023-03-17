import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService, IJWTUser } from '../../share/service/auth.service';
import { ISite, LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userinfo: Observable<IJWTUser | undefined>;
  sites: Observable<ISite[]>;

  public notifications = [
    {
      href: 'https://bsm.yumao.tech',
      img: 'assets/img/avatar2.png',
      text: 'accepted your invitation to join the team.',
      username: 'Jessica Caruso',
      delay: 2,
    },
    {
      href: 'https://bsm.yumao.tech',
      img: 'assets/img/avatar3.png',
      text: 'is now following you',
      username: 'Joel King',
      delay: 3,
    },
    {
      href: 'https://bsm.yumao.tech',
      img: 'assets/img/avatar4.png',
      text: 'is now following you',
      username: 'KKKKK',
      delay: 3,
    },
  ];

  constructor(
    private authservice: AuthService,
    private router: Router,
    public layoutService: LayoutService
  ) {
    this.userinfo = this.authservice.usersubject;
    this.sites = layoutService.Sites.pipe(
      take(6),
      tap((result) => {
        result.forEach((item, i) => {
          let n = Math.round((Math.random() * 10) % 5);
          n = n || 5;
          item.imageurl = `assets/img/app/app-${n}.png`;
          item.name = item.name.substring(0, 4);
          // item.backurl = new URL(item.backurl).origin;
        });
      })
    );
  }

  ngOnInit() {}

  lefttoggle(show: boolean) {
    this.layoutService.showLeftaside = show;
  }
  righttoggle(show: boolean) {
    this.layoutService.showRightaside = show;
  }
  goApp = (app: ISite) => {
    let url = new URL(app.backurl);
    console.log(url);
    if (location.hostname == url.hostname) {
      this.router.navigateByUrl(url.pathname);
    } else {
      window.open(app.backurl, '_blank');
    }
  };

  logout() {
    this.authservice.signOut().subscribe((v) => {
      location.reload();
    });
  }
  gotoUserinfo() {
    this.router.navigate(['user', 'userinfo']);
  }

  refresh() {
    // this.appservice.RefrshPms().subscribe();
  }
}
