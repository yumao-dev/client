import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here 双向绑定
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { ShareModule } from '../share/share.module';
import { PushMsgContentComponent } from './content/content.component';
import { PushMsgRoutingModule } from './pushmsg-routing.module';

@NgModule({
  imports: [
    PushMsgRoutingModule,
    ReactiveFormsModule,
    ShareModule,
    MatCardModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatListModule,
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
