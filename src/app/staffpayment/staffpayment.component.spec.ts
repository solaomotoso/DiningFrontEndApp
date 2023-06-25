import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffpaymentComponent } from './staffpayment.component';

describe('StaffpaymentComponent', () => {
  let component: StaffpaymentComponent;
  let fixture: ComponentFixture<StaffpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
