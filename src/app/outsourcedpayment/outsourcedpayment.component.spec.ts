import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsourcedpaymentComponent } from './outsourcedpayment.component';

describe('OutsourcedpaymentComponent', () => {
  let component: OutsourcedpaymentComponent;
  let fixture: ComponentFixture<OutsourcedpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsourcedpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsourcedpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
