import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from 'src/app/share/service/base-http.service';

@Injectable({ providedIn: 'root' })
export class CaptchaService extends BaseHttpService {
  constructor(http: HttpClient) {
    super(http);
  }
  needCaptcha(): Observable<boolean> {
    // return of(true);
    return this.GetDataHttp<boolean>(
      'GET',
      `https://yumao.tech/user/api/captcha/isshow`
    );
  }
  // readConfig(): Observable<captcha> {
  //   return this.GetDataHttp<{ vid: string; challenge: string }>(
  //     'GET',
  //     `https://yumao.tech/user/api/captcha/new`
  //   );
  // }
}

// interface captcha {
//   vid: string; // 验证单元id
//   type: 'click'; // 显示类型 点击式
//   scene: 0; // 场景值 默认0
//   container: string; //"#vaptchaContainer"; // 容器，可为Element 或者 selector
//   //可选参数
//   //lang: 'auto', // 语言 默认auto,可选值auto,zh-CN,en,zh-TW,jp
//   //https: true, // 使用https 默认 true
//   //style: 'dark' //按钮样式 默认dark，可选值 dark,light
//   //color: '#57ABFF' //按钮颜色 默认值#57ABFF
//   //area: 'auto' //验证节点区域,默认 cn,可选值 auto,sea,na,cn
// }
