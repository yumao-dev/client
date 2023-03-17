import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { map, Observable } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AuthService } from 'src/app/share/service/auth.service';
import { LogService } from 'src/app/share/service/log.service';
import {
  ContainsNameValidator,
  nameValidator,
  passwordreg,
} from '../../service/mobile.validate';
import { IUserEntity, UserService } from '../../service/user.service';

@Component({
  selector: 'app-bind',
  templateUrl: './bind.component.html',
  styleUrls: ['./bind.component.scss'],
})
export class BindComponent implements OnInit {
  color: Observable<ThemePalette>;
  userinfoobs: Observable<IUserEntity>;
  form: FormGroup;
  hide = true;
  constructor(
    private userservice: UserService,
    private authservice: AuthService,
    private log: LogService,
    layoutService: LayoutService,
    containsnameValidator: ContainsNameValidator
  ) {
    this.color = layoutService.setting.pipe(map((a) => a.style));
    this.userinfoobs = this.userservice.getUserInfo();
    this.form = new FormGroup({
      name: new FormControl('', {
        updateOn: 'blur',
        asyncValidators: [
          containsnameValidator.validate.bind(containsnameValidator),
        ],
        validators: [nameValidator, Validators.required],
      }),
      password: new FormControl(null, [
        Validators.pattern(passwordreg),
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    //  服务端提交
    this.userservice.Bind(this.form.value).subscribe({
      next: (result) => {},
      error: (err: Error) => {
        // 弹出注册失败的提示
        this.form.setErrors({
          service:
            err instanceof HttpErrorResponse ? err.error : err.message || err,
        });
        // this.log.debug(err.message);
      },
      complete: () => {
        this.authservice.signOut().subscribe((v) => location.reload());
      },
    });
  }

  getErrorMsg(control: AbstractControl): string | null {
    return this.log.getErrorMsg(control);
  }
}
