import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  links = [
    { label: '注册', path: 'signup' },
    { label: '找回密码', path: 'password' },
    { label: '资料管理', path: 'userinfo' },
    { label: '绑定账号', path: 'userinfo/bind' },
  ];
  activeLink = this.links[0];
}
