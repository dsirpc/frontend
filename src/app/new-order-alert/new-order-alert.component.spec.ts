import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderAlertComponent } from './new-order-alert.component';

describe('NewOrderAlertComponent', () => {
  let component: NewOrderAlertComponent;
  let fixture: ComponentFixture<NewOrderAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOrderAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
