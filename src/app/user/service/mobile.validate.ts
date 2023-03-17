import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from './user.service';

// // @Injectable({ providedIn: 'root' })
// // export class MobileValidator implements AsyncValidatorFn {
// //   constructor(private userService: UserService, private source: number) { }
// //   // (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;

// //   // tslint:disable-next-line: align
// //   // tslint:disable-next-line: no-unused-expression
// //   return (ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
// //     return this.userService.getCapthchaCode(ctrl.value, this.source).pipe(
// //       map(result => (result ? null : { captcha: true } as ValidationErrors)),
// //       catchError(() => of({ captcha: true } as ValidationErrors))
// //     );
// //   };
// // }

// export function MobileValidator(userService: UserService, source: number): AsyncValidatorFn {
//   return (ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
//     return this.userService.getCapthchaCode(ctrl.value, this.source).pipe(
//       map(result => (result ? null : { captcha: true } as ValidationErrors)),
//       catchError(() => of({ captcha: true } as ValidationErrors))
//     );
//   };
// }

@Injectable({ providedIn: 'root' })
export class SignUpContainsNameValidator implements AsyncValidator {
  constructor(private userservice: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userservice.containsName(control.value).pipe(
      map((result) => {
        return !result ? null : { service: '账号已经存在' };
      }),
      catchError((err) => {
        return of({
          service: err instanceof HttpErrorResponse ? err.error : true,
        });
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class ContainsNameValidator implements AsyncValidator {
  constructor(private userservice: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userservice.containsName(control.value).pipe(
      map((result) => {
        return result ? null : { notfound: true };
      }),
      catchError((err) => {
        return of({
          service: err instanceof HttpErrorResponse ? err.error : true,
        });
      })
    );
  }
}

export function nameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let emailValidator = Validators.email(control);
    let phoneValidator = Validators.pattern(phonereg)(control);
    if (emailValidator && phoneValidator) {
      return emailValidator;
    } else {
      return null;
    }
  };
}

export const passwordreg =
  /^[A-Z](?=.*?[0-9])(?=.*?[_!@#$%^&*+-.~])[A-Za-z0-9_!@#$%^&*+-.~]{7,19}$/;
export const phonereg = /^1[3456789]\d{9}$/;
export const nicknamereg = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,10}$/;
export const idcardreg = /^[0-9X]{18}$/;
