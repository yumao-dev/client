import { Injectable } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  isphone: Observable<boolean>;
  private $breadcrumbs = new BehaviorSubject<
    Array<{ label: Data; url: string }>
  >([]);
  constructor(private router: Router, activatedRoute: ActivatedRoute) {
    this.isphone = fromEvent(window, 'resize').pipe(
      startWith(0),
      map((a) => {
        const agent = navigator.userAgent.toLowerCase();
        return (
          agent.match(
            /(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|win ce)/i
          ) != null
        );
      })
    );

    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => {
          // debugger;
          const breadcrumbs: Array<{ label: Data; url: string }> = [];
          let currentRoute: ActivatedRoute | null = activatedRoute.root;
          let url = '';
          do {
            const childrenRoutes = currentRoute.children;
            currentRoute = null;
            childrenRoutes
              .filter((a) => a.outlet === 'primary')
              .forEach((route) => {
                url +=
                  '/' +
                  route.snapshot.url.map((segment) => segment.path).join('/');
                breadcrumbs.push({
                  label: route.snapshot.data,
                  url: url,
                });
                currentRoute = route;
              });
          } while (currentRoute);
          return breadcrumbs;
        })
      )
      .subscribe(this.$breadcrumbs);
  }

  public get breadcrumbs() {
    return this.$breadcrumbs.asObservable();
  }

  public goto(url: string) {
    let u = new URL(url);
    if (location.hostname == u.hostname) {
      this.router.navigateByUrl(url.substring(u.origin.length));
    } else {
      location.href = url;
    }
  }
}
