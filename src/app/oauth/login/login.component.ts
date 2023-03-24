import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { AsyncSubject, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/share/service/auth.service';
import { LogService } from 'src/app/share/service/log.service';
import { CaptchaService } from '../service/captcha.service';
import { OauthService } from '../service/oauth.service';
import { UnionUserService } from '../service/unionuser.service';
declare var vaptcha: any;
const passwordreg =
  /^[A-Z](?=.*?[0-9])(?=.*?[_!@#$%^&*+-.~])[A-Za-z0-9_!@#$%^&*+-.~]{7,19}$/;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  vaptcha_obj: any;
  // showcaptcha!: Observable<boolean>;
  captchacompleted = new AsyncSubject<boolean>();
  backurl: string = 'grant';
  hide = true; //是否显示密码
  appid!: string;
  alipayurl!: string;
  constructor(
    public authservice: AuthService,
    private oauthservice: OauthService,
    private log: LogService,
    private captchaservice: CaptchaService,
    private router: Router,
    private route: ActivatedRoute,
    private service: UnionUserService
  ) {
    this.form = new FormGroup({
      name: new FormControl({
        value: '',
        validators: [Validators.required, this.nameValidator],
      }),
      password: new FormControl({
        value: '',
        validators: [Validators.required, Validators.pattern(passwordreg)],
      }), // 多个验证参数
      captcha: new FormGroup({
        value: new FormControl(),
        key: new FormControl(),
      }),
    });
    this.route.queryParamMap
      .pipe(
        tap((a) => {
          this.backurl = a.get('goto') || this.backurl;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.route.data
      .pipe(
        concatMap((data) => {
          this.appid = data['appid'];
          return this.service.GetOAuthUrl();
        })
      )
      .subscribe((result) => {
        let redirecturl = encodeURIComponent(
          `${location.protocol}//${location.host}/oauth/bind/alipay${location.search}`
        );
        this.alipayurl = `${result.alipay}${redirecturl}`;
      });
    //初始化VAPTCHA对象
    vaptcha({
      vid: '610fc21cb0344c2931649dbb',
      type: 'invisible',
      scene: 0,
      // container: this.chaptchadiv.nativeElement, // 容器，可为Element 或者 selector
      //可选参数
      //lang: 'auto', // 语言 默认auto,可选值auto,zh-CN,en,zh-TW,jp
      // https: true, // 使用https 默认 true
      //style: 'dark' //按钮样式 默认dark，可选值 dark,light
      // color: '#3C8AFF', //按钮颜色 默认值#57ABFF
      //area: 'auto' //验证节点区域,默认 cn,可选值 auto,sea,na,cn
    }).then((vaptchaObj: any) => {
      this.vaptcha_obj = vaptchaObj; //将VAPTCHA验证实例保存到局部变量中
      vaptchaObj.listen('pass', () => {
        let serverToken = vaptchaObj.getServerToken();
        this.form.controls['captcha'].get('key')!.setValue(serverToken.server);
        this.form.controls['captcha'].get('value')!.setValue(serverToken.token);
        this.captchacompleted!.next(true);
        this.captchacompleted!.complete();
      });
      //关闭验证弹窗时触发
      // vaptchaObj.listen('close', () => {
      //   //验证弹窗关闭触发
      //   this.captchacompleted?.unsubscribe();
      //   this.captchacompleted = undefined;
      // });
    });
  }

  login() {
    this.captchaservice
      .needCaptcha()
      .pipe(
        concatMap((need) => {
          if (need) {
            this.vaptcha_obj.validate();
            return this.captchacompleted.pipe(map((r) => need));
          } else {
            return of(need);
          }
        }),
        concatMap((need) => {
          let formvalue = this.form.value;
          if (need && (!formvalue.captcha.key || !formvalue.captcha.value)) {
            throw new Error('请进行人机验证');
          }
          return this.oauthservice.signIn(formvalue, this.appid);
        })
      )
      .subscribe({
        next: (r) => {
          this.vaptcha_obj?.reset();
          if (r) {
            this.goto();
          }
        },
        error: (err) => {
          this.vaptcha_obj?.reset();
          return this.log.Write('Error', err);
        },
      });
  }

  goto() {
    if (this.backurl) {
      let tree: UrlTree;
      if (this.backurl.includes('?')) {
        tree = this.router.parseUrl(this.backurl);
      } else {
        // tree = this.router.parseUrl(this.backurl);

        tree = this.router.createUrlTree([this.backurl], {
          relativeTo: this.route.parent,
          queryParamsHandling: 'preserve',
        });
      }

      this.router.navigateByUrl(tree);
    }
  }

  nameValidator = (ctrl: AbstractControl<string>) => {
    let emailValidator = Validators.email(ctrl);
    let phoneValidator = Validators.pattern(/^1[3456789]\d{9}$/)(ctrl);
    if (emailValidator && phoneValidator) {
      return emailValidator;
    } else {
      return null;
    }
  };
}
