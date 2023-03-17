import { Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Settings {
  name: string;
  version: string;
  showHeader: boolean;
  showLeftaside: boolean;
  showRightaside: boolean;

  style: ThemePalette;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _leftnav = new BehaviorSubject<boolean>(false);
  private _rightnav = new BehaviorSubject<boolean>(false);
  private _header = new BehaviorSubject<boolean>(true);

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

  constructor() {
    this._setting = combineLatest([
      this._app,
      this._header,
      this._leftnav,
      this._rightnav,
      this._style,
    ]).pipe(
      map(([app, header, left, right, style]) => {
        return {
          name: app.name,
          version: app.version,
          showHeader: header,
          showLeftaside: left,
          showRightaside: right,
          style: style,
        } as Settings;
      })
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
