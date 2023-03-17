import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AuthService } from 'src/app/share/service/auth.service';
import {
  ILoginLog,
  IUserEntity,
  UserService,
} from '../../service/user.service';
import { EmailComponent } from '../email/email.component';
import { IdcardComponent } from '../idcard/idcard.component';
import { NicknameComponent } from '../nickname/nickname.component';
import { PhoneComponent } from '../phone/phone.component';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss'],
})
export class UserinfoComponent implements OnInit {
  refresh = new Subject<boolean>();
  // user: Observable<IJWTUser | undefined>;
  color: Observable<ThemePalette>;
  userinfoobs: Observable<IUserEntity>;
  loginlogs: Observable<Array<ILoginLog>>;
  displayedColumns: string[] = ['indate', 'IP', 'App'];
  token: string | null = null;
  constructor(
    private authservice: AuthService,
    private userservice: UserService,
    public layoutService: LayoutService,
    public dialog: MatDialog
  ) {
    this.loginlogs = this.userservice.LoginLogs();
    this.color = this.layoutService.setting.pipe(map((a) => a.style));
    // this.user = combineLatest([
    //   this.authservice.usersubject,
    //   this.userservice.getUserInfo(),
    // ]).pipe(
    //   map(([user, userinfo]) => {
    //     if (user && userinfo) return { ...user, ...userinfo };
    //     else return undefined;
    //   })
    // );

    this.userinfoobs = this.refresh.pipe(
      startWith(true),
      filter((a) => a),
      switchMap((a) => this.userservice.getUserInfo())
    );
  }

  ngOnInit(): void {
    // this.authservice.tokenObservable.pipe(
    //   filter(a => Boolean(a)),
    //   switchMap(a => this.authservice.userInfo),
    //   catchError(err => {
    //     return of(undefined);
    //   })
    // ).subscribe(result => this.user = result);
    // this.refresh
    //   .pipe(
    //     filter((a) => a && !this.token),
    //     concatMap((t) => this.authservice.signIn(this.token!))
    //   )
    //   .subscribe();
  }

  openNicknameDialog(): void {
    this.dialog
      .open(NicknameComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe(this.refresh);
  }
  openIDcardDialog(): void {
    this.dialog
      .open(IdcardComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe(this.refresh);
  }
  openPhoneDialog(item: IUserEntity): void {
    this.dialog
      .open(PhoneComponent, {
        data: item,
        disableClose: true,
      })
      .afterClosed()
      .subscribe(this.refresh);
  }
  openEmailDialog(item: IUserEntity): void {
    this.dialog
      .open(EmailComponent, {
        data: item,
        disableClose: true,
      })
      .afterClosed()
      .subscribe(this.refresh);
  }
}
