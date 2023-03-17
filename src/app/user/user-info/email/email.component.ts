import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  catchError,
  filter,
  interval,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { LogService } from 'src/app/share/service/log.service';
import {
  CaptchaType,
  IUserEntity,
  UserService,
} from '../../service/user.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent {
  email = new FormControl<string>('', [Validators.email, Validators.required]);
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
      filter((r) => r),
      switchMap((r) => {
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
    this.userservice.newEmailOrPhone(this.email.value!, 'email').subscribe({
      next: (result) => {
        if (result) {
          this.dialogRef.close(true);
        } else {
          this.email.setErrors({ service: true });
        }
      },
      error: (err: Error) => {
        this.email.setErrors({
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
      .setEmailOrPhone(this.email.value!, 'email', this.captchavalue.value!)
      .subscribe({
        next: (result) => {
          if (result) {
            this.dialogRef.close(true);
          } else {
            this.email.setErrors({ service: true });
          }
        },
        error: (err: Error) => {
          // 弹出注册失败的提示
          this.email.setErrors({
            service:
              err instanceof HttpErrorResponse ? err.error : err.message || err,
          });
          // this.log.debug(err.message);
        },
      });
  }

  send() {
    this.captchavalue.reset();
    // this.captchaicon = 'sync';
    this.senderror = '';
    this.userservice
      .SendCapthcha('email', CaptchaType.setname)
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
