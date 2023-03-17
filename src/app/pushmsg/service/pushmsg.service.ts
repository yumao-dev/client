import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from 'src/app/share/service/base-http.service';

@Injectable({ providedIn: 'root' })
export class PushMsgService extends BaseHttpService {
  constructor(http: HttpClient) {
    super(http);
  }

  private get domain() {
    return !isDevMode() || true ? 'https://yumao.tech/pushmsg' : '';
  }

  public AddConfig(entity: IConfigEntity): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      entity.id && entity.id > 0 ? 'PUT' : 'POST',
      `${this.domain}/api/config/${
        entity.id && entity.id > 0 ? entity.id : ''
      }`,
      { webhook: entity.webhook }
    );
  }

  public Get(): Observable<IConfigEntity> {
    return super
      .GetDataHttp<IConfigEntity>('GET', `${this.domain}/api/config`)
      .pipe(
        tap((config) => {
          config.url = `${this.domain}/api/msg/send/${config.code}`;
        })
      );
  }

  public SendMsg(code: string, msg: string): Observable<boolean> {
    return super.GetDataHttp<boolean>(
      'POST',
      `${this.domain}/api/msg/send/${code}`,
      {
        msg: msg,
      }
    );
  }
}

export interface IConfigEntity {
  id: number;
  userid: number;
  code: string;
  webhook: string;
  modifydate: Date;
  createdate: Date;
  url?: string;
}
