import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// @Injectable()
export class BaseHttpService {
  constructor(protected http: HttpClient) {}

  protected GetDataHttp<T>(
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    url: string,
    data?: any,
    responsetype: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json'
  ): Observable<T> {
    const urlparams: HttpParams = new HttpParams({ fromObject: data });
    return this.http
      .request(method, url, {
        body: data,
        params: method === 'GET' ? urlparams : undefined,
        responseType: responsetype,
        withCredentials: true,
      })
      .pipe(
        // debounceTime(300),// 每次都是一个新的subscribe，debounceTime在这里毫无意义
        // distinctUntilChanged((x, y) => {
        //     return x.url == y.url;
        // }),
        map((response) => response as Result<T>),
        map((result) => {
          if (result.Result) {
            return result.Data;
          } else {
            throw new Error(result.Error || JSON.stringify(result));
          }
        })
      );
  }
}

export interface QueryResult<T = any> {
  Total: number;
  TotalPage: number;
  Data: T[];
}
export interface Result<T = any> {
  Error?: string;
  Data: T;
  Result: boolean;
  ErrorType?: number;
}

export interface BaseQueryParam {
  page: number;
  size: number;
}

export interface Status<T> {
  key: T;
  value: string;
  description?: string;
}

// export interface IOrderDetailEntity {
//     name: string;
//     num: number;
//     size: string;
//     price: number;
// }
