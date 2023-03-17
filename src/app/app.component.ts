import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, share, switchMap } from 'rxjs';
import { AuthService } from './share/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const localactivatedRoute = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      share()
    );
    localactivatedRoute
      .pipe(switchMap((route) => route.data))
      .subscribe((data) => {
        if (data['title']) {
          this.titleService.setTitle(data['title']);
        }
      });
  }
}
