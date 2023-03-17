import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { LogService } from 'src/app/share/service/log.service';
import { nicknamereg } from '../../service/mobile.validate';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.scss'],
})
export class NicknameComponent implements OnInit {
  nickname: UntypedFormControl;
  color: Observable<ThemePalette>;
  constructor(
    public dialogRef: MatDialogRef<NicknameComponent>,
    private log: LogService,
    private userservice: UserService,
    public layoutService: LayoutService
  ) {
    this.color = this.layoutService.setting.pipe(map((a) => a.style));

    this.nickname = new FormControl<string>('', [
      Validators.pattern(nicknamereg),
      Validators.required,
    ]);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    //  服务端提交
    this.userservice.setNickName(this.nickname.value).subscribe({
      next: (result) => {
        if (result) {
          this.dialogRef.close(true);
        } else {
          this.nickname.setErrors({ service: true });
        }
      },
      error: (err: Error) => {
        // 弹出注册失败的提示
        this.nickname.setErrors({
          service:
            err instanceof HttpErrorResponse ? err.error : err.message || err,
        });
        // this.log.debug(err.message);
      },
    });
  }

  getErrorMsg(control: AbstractControl): string | null {
    return this.log.getErrorMsg(control);
  }
}
