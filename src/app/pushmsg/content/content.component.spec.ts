import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushMsgContentComponent } from './content.component';

describe('AppContentComponent', () => {
  let component: PushMsgContentComponent;
  let fixture: ComponentFixture<PushMsgContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PushMsgContentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushMsgContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
