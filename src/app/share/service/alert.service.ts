// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// // @Injectable()
// export class AlertService {
//   private alerts = new Subject<AlertMessage>();

//   constructor() {
//   }

//   public get messages() {
//     return this.alerts.asObservable();
//   }

//   // tslint:disable-next-line: variable-name
//   public add = (t_type: `success` | `info` | `warning` | `danger`, t_msg: string, t_timeout: number = 3000) => {
//     this.alerts.next({
//       type: t_type,
//       msg: t_msg,
//       timeout: t_timeout
//     });
//   }
// }

// export interface AlertMessage {
//   type: `success` | `info` | `warning` | `danger`;
//   msg: string;
//   timeout: number;
// }
