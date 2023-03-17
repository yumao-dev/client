import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpService } from 'src/app/share/service/base-http.service';

export interface Settings {
  name: string;
  version: string;
  showHeader: boolean;
  showLeftaside: boolean;
  showRightaside: boolean;

  style: ThemePalette;
}

@Injectable({ providedIn: 'root' })
export class LayoutService extends BaseHttpService {
  private _leftnav = new BehaviorSubject<boolean>(false);
  private _rightnav = new BehaviorSubject<boolean>(false);
  private _header = new BehaviorSubject<boolean>(true);
  private _ismobile = new BehaviorSubject<boolean>(false);

  private _style = new BehaviorSubject<ThemePalette>('primary');
  private _app = of({
    name: 'angular-Template',
    version: '1.0.0',
  });
  private _setting: Observable<Settings>;

  public get setting() {
    return this._setting;
  }

  public set style(v: ThemePalette) {
    this._style.next(v);
  }
  public set showHeader(v: boolean) {
    this._header.next(v);
  }
  public set showLeftaside(v: boolean) {
    this._leftnav.next(v);
  }
  public set showRightaside(v: boolean) {
    this._rightnav.next(v);
  }

  constructor(http: HttpClient) {
    super(http);
    this._setting = combineLatest([
      this._app,
      this._header,
      this._leftnav,
      this._rightnav,
      this._style,
      this._ismobile,
    ]).pipe(
      map(([app, header, left, right, style, ismobile]) => {
        return {
          name: app.name,
          version: app.version,
          showHeader: header,
          showLeftaside: left,
          showRightaside: right,
          style: style,
          ismobile: ismobile,
        } as Settings;
      })
    );
  }

  public get Sites(): Observable<ISite[]> {
    return this.GetDataHttp<ISite[]>(
      'GET',
      'https://service.yumao.tech/pms/api/domain/query'
    );
  }
}

export interface LayoutConfig {
  header?: string;
  footer?: string;
  leftside?: string;
  rightside?: string;
}
export enum MenuStep {
  content,
  config,
}

export interface ISite {
  domainid: string;
  name: string;
  backurl: string;
  description: string;
  imageurl: string;
  status: boolean;
  issite: boolean;
}
