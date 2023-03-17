import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, delay, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AuthService } from 'src/app/share/service/auth.service';
import { LogService } from 'src/app/share/service/log.service';
import {
  phonereg,
  SignUpContainsNameValidator,
} from '../../service/mobile.validate';
import { CaptchaType, UserService } from '../../service/user.service';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
})
export class PhoneComponent {
  public registerResult = false;
  public source = '';
  form: FormGroup;
  constructor(
    private userservice: UserService,
    private log: LogService,
    public layoutService: LayoutService,
    private authservice: AuthService,
    private containsnameValidator: SignUpContainsNameValidator,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      name: new FormControl<string>('', {
        updateOn: 'blur',
        asyncValidators: [
          this.containsnameValidator.validate.bind(this.containsnameValidator),
        ],
        validators: [Validators.pattern(phonereg), Validators.required],
      }),
      captchavalue: new FormControl<string>('', [
        Validators.maxLength(6),
        Validators.minLength(4),
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.source = data['source'];
    });
  }

  onSubmit(): void {
    //  服务端提交
    this.userservice
      .register({ ...this.form.value }, 'phone', this.source)
      .subscribe({
        next: (result) => {
          this.registerResult = result;
          if (result) {
            this.authservice.signOut().pipe(delay(3000)).subscribe();
          }
        },
        error: (err: Error) => {
          // 弹出注册失败的提示
          this.form.setErrors({
            service:
              err instanceof HttpErrorResponse
                ? err.error
                : err.message || true,
          });
        },
      });
  }

  send() {
    this.form.get('captchavalue')!.reset();
    this.userservice
      .getCapthchaCode(this.form.get('name')!.value, CaptchaType.reg)
      .pipe(
        catchError((err) => {
          this.form.get('name')!.setErrors({
            captcha:
              err instanceof HttpErrorResponse ? err.error : err.message || err,
          });
          return of(false);
        })
      )
      .subscribe((r) => {
        // this.captchaicon = 'check_circle';
      });
  }

  getErrorMsg(control: AbstractControl): string | null {
    return this.log.getErrorMsg(control);
  }
}
