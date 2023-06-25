import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestpaymentComponent } from './guestpayment.component';

describe('GuestpaymentComponent', () => {
  let component: GuestpaymentComponent;
  let fixture: ComponentFixture<GuestpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
