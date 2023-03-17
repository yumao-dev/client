import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Injectable()
export class AlertsService {
  private alerts: Array<AlertMessage> = [];

  constructor(public snackBar: MatSnackBar) {}

  // t_timeout 单位秒
  public add = (
    t_type: `success` | `info` | `warning` | `danger`,
    t_msg: string,
    t_timeout: number = 10
  ): void => {
    // this.alerts.push({
    //   type: t_type,
    //   msg: t_msg,
    //   timeout: t_timeout * 1000
    // });
    this.snackBar.open(t_msg, 'close', {
      duration: t_timeout * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      // politeness: 'assertive'
    });
  };

  // public addmodal = (t_msg: string, title: string, msg: string, t_timeout: number = 10): void => {
  //   this.snackBar.openFromComponent(AlertModalComponent, {
  //     duration: t_timeout * 1000,
  //     // politeness: 'assertive',
  //     // horizontalPosition: 'center',
  //     // verticalPosition: 'top',
  //     data: {
  //       title: title,
  //       content: msg
  //     }
  //   });
  // }
}

export interface AlertMessage {
  type: `success` | `info` | `warning` | `danger`;
  msg: string;
  timeout: number;
}
