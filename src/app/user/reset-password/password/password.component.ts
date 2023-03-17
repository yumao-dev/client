import { CdkStep, StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { interval, Observable, throwError } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AuthService } from 'src/app/share/service/auth.service';
import { LogService } from 'src/app/share/service/log.service';
import {
  ContainsNameValidator,
  nameValidator,
  passwordreg,
} from '../../service/mobile.validate';
import { CaptchaType, UserService } from '../../service/user.service';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  // @ViewChild(MatHorizontalStepper)
  private stepper: CdkStep | undefined;

  color!: Observable<ThemePalette>;
  waittime: number = 0;
  hide = true;
  optmethods: Array<{ key: string; value: string }> = [];
  name: FormControl<string | null>;
  method: FormControl<{ key: string; value: string } | null>;

  mobileForm: FormGroup;
  emailForm: FormGroup;
  idcardForm: FormGroup;
  constructor(
    private userservice: UserService,
    private authservice: AuthService,
    private log: LogService,
    public layoutService: LayoutService,
    private containsnameValidator: ContainsNameValidator
  ) {
    this.color = this.layoutService.setting.pipe(map((a) => a.style));
    // this.optmethods = this.stepFirstCompleted
    //   .pipe(
    //     filter((a) => a),
    //     switchMap((a) => this.userservice.getOptMethods())
    //   )
    //   .pipe(
    //     // map(methods => {
    //     //   return this.methoddescriptions.filter(item => {
    //     //     return methods.includes(item.key);
    //     //   });
    //     // }),
    //     catchError((err) => {
    //       return of([]);
    //     })
    //   );

    this.name = new FormControl<string>('', {
      updateOn: 'blur',
      asyncValidators: [
        this.containsnameValidator.validate.bind(this.containsnameValidator),
      ],
      validators: [Validators.required, nameValidator],
    });
    this.method = new FormControl<{ key: string; value: string } | null>(null, [
      Validators.required,
    ]);

    this.mobileForm = new FormGroup({
      captchavalue: new FormControl(null, [
        Validators.minLength(4),
        Validators.maxLength(6),
        Validators.required,
      ]),
      password: new FormControl(null, [
        Validators.pattern(passwordreg),
        Validators.required,
      ]),
    });
    this.emailForm = new FormGroup({
      captchavalue: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.maxLength(6),
        Validators.required,
      ]),
      password: new FormControl<string>('', [
        Validators.pattern(passwordreg),
        Validators.required,
      ]),
    });
    this.idcardForm = new FormGroup({
      idcard: new FormControl(null, [
        Validators.minLength(16),
        Validators.maxLength(18),
        Validators.required,
      ]),
      password: new FormControl(null, [
        Validators.pattern(passwordreg),
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {}

  send(type: 'phone' | 'email') {
    this.mobileForm.get('captchavalue')!.reset();
    this.emailForm.get('captchavalue')!.reset();
    // this.captchaicon = 'sync';
    this.userservice.SendCapthcha(type, CaptchaType.getpwd).subscribe({
      next: (r) => {
        // this.captchaicon = 'check_circle';
      },
      error: (err) => {
        // this.captchaicon = 'error';
        // this.log.error(err, '发送验证码', true);
        // this.form.get('mobile').status
        // this.name.setErrors({ service: err instanceof HttpErrorResponse ? err.error : true });
        if (type == 'phone')
          this.mobileForm.get('captchavalue')!.setErrors({ captcha: true });
        else this.emailForm.get('captchavalue')!.setErrors({ captcha: true });
      },
    });
  }
  onStepperSelect(item: StepperSelectionEvent): void {
    if (item.previouslySelectedIndex < item.selectedIndex)
      item.selectedStep.reset();
    this.stepper = item.selectedStep;
  }

  onFirstStepper(item: CdkStep): void {
    item.interacted = false;
    this.userservice
      .getPasswordToken(this.name.value!)
      .pipe(
        concatMap((r) => {
          if (r) {
            return this.userservice.getOptMethods();
          } else {
            return throwError(new Error('生成token失败'));
          }
        })
      )
      // of([{ key: 'email', value: '***' }])
      .subscribe({
        next: (v) => {
          this.optmethods = v;
          item.interacted = true;
          item._stepper.next();
        },
        error: (err) => {
          // 弹出注册失败的提示
          this.name.setErrors({
            service:
              err instanceof HttpErrorResponse ? err.error : err.message || err,
          });
        },
      });
  }

  onIDcardSubmit(): void {
    if (this.idcardForm.invalid) {
      return;
    }
    //  服务端提交
    this.userservice
      .passwordByIDcard(this.idcardForm.value)
      .pipe(
        tap((result) => {
          if (result) {
            this.successtime();
          }
        })
      )
      .subscribe(
        (result) => {
          if (result) {
            // this.stepper.next();
            window.location.href = '/';
          } else {
            this.idcardForm.setErrors({ service: true });
          }
        },
        (err: Error) => {
          // 弹出注册失败的提示
          this.idcardForm.setErrors({
            service:
              err instanceof HttpErrorResponse
                ? err.error
                : err instanceof Error
                ? err.message
                : true,
          });
        }
      );
  }

  onMobileSubmit(): void {
    let captchavalue = this.mobileForm.get('captchavalue')?.value;
    this.mobileForm.get('captchavalue')?.reset();
    //  服务端提交
    this.userservice
      .NewPasswordByCaptcha(
        this.mobileForm.get('password')?.value,
        {
          code: this.name.value!,
          value: captchavalue,
        },
        'phone'
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.stepper?._stepper.next();
            this.successtime();
          } else {
            this.mobileForm.setErrors({ service: true });
          }
        },
        error: (err: Error) => {
          // 弹出注册失败的提示
          // this.log.debug(err.message);
          this.mobileForm.setErrors({
            service:
              err instanceof HttpErrorResponse
                ? err.error
                : err instanceof Error
                ? err.message
                : true,
          });
        },
      });
  }
  onEmailSubmit(): void {
    let captchavalue = this.emailForm.get('captchavalue')?.value;
    this.emailForm.get('captchavalue')?.reset();
    this.userservice
      .NewPasswordByCaptcha(
        this.emailForm.get('password')?.value,
        {
          code: this.name.value!,
          value: captchavalue,
        },
        'email'
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.stepper?._stepper.next();
            this.successtime();
          } else {
            this.emailForm.setErrors({ service: true });
          }
        },
        error: (err: Error) => {
          // 弹出注册失败的提示
          // this.log.debug(err.message);
          this.emailForm.setErrors({
            service:
              err instanceof HttpErrorResponse
                ? err.error
                : err instanceof Error
                ? err.message
                : true,
          });
        },
      });
  }

  successtime(): void {
    interval(1000)
      .pipe(take(5))
      .subscribe({
        next: (r) => {
          this.waittime = 5 - r;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.authservice.signOut().subscribe((r) => {
            // this.authservice.signInAfter(true);
            location.reload();
          });
        },
      });
  }

  getErrorMsg(control: AbstractControl): string | null {
    return this.log.getErrorMsg(control);
  }
}
