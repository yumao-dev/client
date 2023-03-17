import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  catchError,
  concatMap,
  filter,
  interval,
  map,
  Observable,
  of,
  Subject,
  take,
  tap,
} from 'rxjs';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { LogService } from 'src/app/share/service/log.service';
import { phonereg } from '../../service/mobile.validate';
import {
  CaptchaType,
  IUserEntity,
  UserService,
} from '../../service/user.service';
import { EmailComponent } from '../email/email.component';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
})
export class PhoneComponent {
  phone = new FormControl<string>('', [
    Validators.pattern(phonereg),
    Validators.required,
  ]);
  sendCompleted = new Subject<boolean>();
  captchatimer: Observable<number>;
  captchavalue = new FormControl<string>('', [
    Validators.minLength(4),
    Validators.maxLength(6),
    Validators.required,
  ]);
  color: Observable<ThemePalette>;
  senderror: string = '';
  constructor(
    public dialogRef: MatDialogRef<EmailComponent>,
    private log: LogService,
    private userservice: UserService,
    public layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA) public data: IUserEntity
  ) {
    this.color = this.layoutService.setting.pipe(map((a) => a.style));
    this.captchatimer = this.sendCompleted.pipe(
      tap(console.log),
      filter((r) => r),
      concatMap((r) => {
        return interval(1000).pipe(
          take(60),
          map((t) => {
            return 59 - t;
          })
        );
      })
    );
  }

  onSubmit(): void {
    //  服务端提交
    this.userservice.newEmailOrPhone(this.phone.value!, 'phone').subscribe({
      next: (result) => {
        if (result) {
          this.dialogRef.close(true);
        } else {
          this.phone.setErrors({
            service: '此手机号账号已经存在，不能修改，建议绑定到此手机号',
          });
        }
      },
      error: (err: Error) => {
        this.phone.setErrors({
          service:
            err instanceof HttpErrorResponse ? err.error : err.message || err,
        });
        // this.log.debug(err.message);
      },
    });
  }

  onModifySubmit(): void {
    //  服务端提交
    this.userservice
      .setEmailOrPhone(this.phone.value!, 'phone', this.captchavalue.value!)
      .subscribe({
        next: (result) => {
          if (result) {
            this.dialogRef.close(true);
          } else {
            this.phone.setErrors({ service: true });
          }
        },
        error: (err: Error) => {
          // 弹出注册失败的提示
          this.phone.setErrors({
            service:
              err instanceof HttpErrorResponse ? err.error : err.message || err,
          });
          // this.log.debug(err.message);
        },
      });
  }

  send(event: any) {
    this.captchavalue.reset();
    this.senderror = '';
    this.userservice
      .SendCapthcha('phone', CaptchaType.setname)
      .pipe(
        catchError((err) => {
          this.senderror =
            err instanceof HttpErrorResponse ? err.error : err.message || err;
          return of(false);
        })
      )
      .subscribe((r) => {
        this.sendCompleted.next(r);
      });
  }

  getErrorMsg(control: AbstractControl): string | null {
    return this.log.getErrorMsg(control);
  }
}
