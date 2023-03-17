import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LogService } from '../../share/service/log.service';
import { LayoutService } from '../service/layout.service';
// import { LayoutService, MenuStep } from '../service/layout.service';
// import { LogService, LocalStorageService } from '../../share/export';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent implements OnInit {
  constructor(private log: LogService, public layoutService: LayoutService) {}
  // public selectedcateid = -1;
  // public expandconfig = false;
  public expandmenu = false;
  // panelOpenState = false;
  // public cates: Observable<ICateAppEntity[]>;
  // panelOpenState = false;
  // public cates: Observable<ICateAppEntity[]>;
  public menus!: Observable<{ label: string; url: string; id: number }[]>;

  expandedStep = 0;

  public ngOnInit() {
    // this.layoutservice.secondRoute.subscribe(r => this.expandedStep = r);
    // this.cates = combineLatest(
    //   this.appservice.Cates.pipe(map((a) => a ? a.filter((b) => b.status) : [])),
    //   this.appservice.Apps.pipe(map((a) => a ? a.filter((b) => b.status) : [])),
    //   (cates, apps) => {
    //     return cates.map((cate) => {
    //       return {
    //         id: cate.id,
    //         name: cate.name,
    //         description: cate.description,
    //         status: cate.status,
    //         apps: apps.filter((a) => a.cateid === cate.id),
    //       };
    //     });
    //   });
    // // 监听路由变化展开菜单
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   // tap(r => console.log(r)),
    //   mapTo(this.activatedRoute.firstChild),
    //   map(route => {
    //     // console.log(route);
    //     return route.routeConfig.path;
    //   })
    // ).pipe(tap(result => {
    //   // console.log(result);
    //   this.expandedStep = Step[result];
    // }), catchError(err => {
    //   this.log.error(err, "监听URL变化");
    //   return of("");
    // })).subscribe();
    // this.router.events.subscribe((data) => {
    //   if (data instanceof NavigationEnd) {
    //     console.log(data.url);
    //   }
    // });
  }

  // public filterapp(app: IAppEntity, cate: ICateEntity) {
  //   return app.cateid === cate.id;
  // }

  // public track(index: number, value: any): number { return value.id; }

  // public SelectCate(cate: ICateEntity): void {
  //   if (this.selectedcateid !== cate.id) {
  //     this.selectedcateid = cate.id;
  //   } else {
  //     this.selectedcateid = -1;
  //   }
  // }
}
// interface ConfigNode {
//   label: string;
//   url: string;
//   id: number;
//   children?: ConfigNode[];
// }
