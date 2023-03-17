import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../service/auth.service';
// import { ConfigService, LogService } from '../share.module';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  constructor(
    private authservice: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const code = data['authcode'];
      if (code) {
        this.authservice
          .signIn(code)
          .pipe(
            tap((r) => {
              this.authservice.signInAfter(r);
            })
          )
          .subscribe();
      }
    });
  }

  ngOnDestroy(): void {}
}
