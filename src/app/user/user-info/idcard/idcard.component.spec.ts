import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IdcardComponent } from './idcard.component';

describe('IdcardComponent', () => {
  let component: IdcardComponent;
  let fixture: ComponentFixture<IdcardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IdcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
