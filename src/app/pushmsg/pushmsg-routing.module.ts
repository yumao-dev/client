import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PushMsgContentComponent } from './content/content.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: PushMsgConfigComponent,
  //   data: { title: '应用配置', resourceid: 16 },
  // },
  {
    path: '',
    component: PushMsgContentComponent,
    title: '消息内容',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PushMsgRoutingModule {}
