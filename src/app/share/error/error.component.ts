import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  msg: Observable<string>;
  constructor(private route: ActivatedRoute) {
    this.msg = this.route.queryParamMap.pipe(
      map((params) => {
        return params.get('msg') || '找不到对象';
      })
    );
  }
}
