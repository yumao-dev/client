import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, IJWTUser } from '../../share/service/auth.service';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userinfo: Observable<IJWTUser | undefined>;

  // @Input() leftnav!: MatSidenav;
  // @Input() rightnav!: MatSidenav;

  public apps = [
    {
      href: 'https://bsm.yumao.tech',
      img: 'assets/img/github.png',
      text: '权限',
    },
    {
      href: 'https://bsm.yumao.tech',
      img: 'assets/img/slack.png',
      text: '配置',
    },
  ];

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
    public layoutService: LayoutService
  ) {
    this.userinfo = this.authservice.usersubject;
  }

  ngOnInit() {}

  logout() {
    this.authservice.signOut().subscribe((v) => {
      location.reload();
    });
  }

  refresh() {
    // this.appservice.RefrshPms().subscribe();
  }
}
