import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { LogService } from '../../share/service/log.service';
import { IConfigEntity, PushMsgService } from '../service/pushmsg.service';

@Component({
  selector: 'pushmsg-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PushMsgContentComponent implements OnInit {
  levels!: Observable<string[]>;

  isLoading = true;
  search = new Subject<boolean>();

  stepperOrientation!: Observable<StepperOrientation>;
  webhookerror = '';
  msgerror = '';
  config: IConfigEntity = {} as IConfigEntity;
  firstcompleted = false;
  webhook: UntypedFormControl;
  msg: UntypedFormControl;

  constructor(
    private log: LogService,
    public appService: PushMsgService,
    public layout: LayoutService,
    breakpointObserver: BreakpointObserver
  ) {
    //手机端PC段自适应
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.webhook = new UntypedFormControl('', [Validators.required]);
    this.msg = new UntypedFormControl('', [Validators.required]);
  }

  ngOnInit(): void {
    this.appService.Get().subscribe(
      (result) => {
        this.webhook.setValue(result.webhook);
        this.config = result;
        this.firstcompleted = true;
        this.webhook.valueChanges.subscribe((r) => {
          this.firstcompleted = this.config.webhook == r;
        });
      },
      (err: Error) => {
        // this.firstFormGroup.get('webhook')?.setErrors({ require: err.message });
        this.webhookerror = err.message;
      }
    );
  }

  save() {
    this.webhook.updateValueAndValidity();
    if (this.webhook.errors) {
      this.webhookerror = '接口地址有误，请重新填写';
    } else if (this.config.webhook != this.webhook.value) {
      this.appService
        .AddConfig({ ...this.config!, webhook: this.webhook.value })
        .subscribe(
          (result) => {
            this.firstcompleted = result;
          },
          (err) => {
            this.webhookerror = err.message;
          }
        );
    }
  }

  send = () => {
    this.msg.updateValueAndValidity();
    if (this.msg.errors) {
      this.msgerror = '消息内容有误，请重新填写';
    } else if (this.config.code) {
      this.appService.SendMsg(this.config.code, this.msg.value).subscribe({
        next: (result) => {
          if (result)
            this.log.Write('INFO', '发送成功', undefined, false, true);
          else this.log.Write('INFO', '发送成功', undefined, false, true);
        },
        error: (err) => {
          this.msgerror = err.message;
        },
      });
    }
  };
}
