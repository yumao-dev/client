import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here 双向绑定
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { ShareModule } from '../share/share.module';
import { PushMsgContentComponent } from './content/content.component';
import { PushMsgRoutingModule } from './pushmsg-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PushMsgRoutingModule,
    ReactiveFormsModule,
    ShareModule,
    MatStepperModule,
    MatProgressSpinnerModule,
  ],
  declarations: [PushMsgContentComponent],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class PushMsgModule {}
