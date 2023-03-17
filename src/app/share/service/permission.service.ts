import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService extends BaseHttpService {
  constructor(http: HttpClient) {
    super(http);
  }
  public checkStatus(appcode: string): Observable<boolean> {
    return this.GetDataHttp<boolean>(
      'GET',
      `https://service.yumao.tech/pms/api/canvisit/${appcode}`
    ).pipe(
      catchError((err) => {
        return of(false);
      })
    );
  }
}
