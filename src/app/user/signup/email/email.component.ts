import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AuthService } from 'src/app/share/service/auth.service';
import { LogService } from 'src/app/share/service/log.service';
import {
  passwordreg,
  SignUpContainsNameValidator,
} from '../../service/mobile.validate';
import { UserService } from '../../service/user.service';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent {
  public registerResult = false;
  public source = '';
  form: FormGroup;
  constructor(
    private userservice: UserService,
    private log: LogService,
    public layoutService: LayoutService,
    private containsnameValidator: SignUpContainsNameValidator,
    private authservice: AuthService,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      name: new FormControl('', {
        updateOn: 'blur',
        asyncValidators: [
          this.containsnameValidator.validate.bind(this.containsnameValidator),
        ],
        validators: [Validators.email, Validators.required],
      }),
      password: new FormControl(null, [
        Validators.pattern(passwordreg),
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
      .register({ ...this.form.value }, 'email', this.source)
      .subscribe({
        next: (result) => {
          this.registerResult = result;
          if (result) {
            this.authservice.signOut().pipe(delay(5000)).subscribe();
          }
        },
        error: (err: Error) => {
          // 弹出注册失败的提示
          // this.log.debug(err.message);
          this.form.setErrors({
            service:
              err instanceof HttpErrorResponse
                ? err.error
                : err.message || true,
          });
        },
      });
  }

  getErrorMsg(control: AbstractControl): string | null {
    return this.log.getErrorMsg(control);
  }
}
