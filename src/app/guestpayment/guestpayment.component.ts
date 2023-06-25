import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { GenericValidator } from '../shared/generic-validator';
import { Payment } from '../staffpayment/payment.model';
import { PaymentService } from '../staffpayment/payment.service';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { OrderedMeal } from './orderedmeal.model';
import { OrderedMealService } from './orderedmeal.service';

@Component({
  selector: 'app-guestpayment',
  templateUrl: './guestpayment.component.html',
  styleUrls: ['./guestpayment.component.scss']
})
export class GuestpaymentComponent implements OnInit {

  amountValue: number = 0;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  pageTitle = "New Guest/Staff ticket"
  staffid = 3;
  errorMessage = '';
  orderedMealForm!: FormGroup;
  // voucherForm!:FormGroup;
  menus!: Menu[];
  menu!: Menu;
  payment!: Payment;
  ordMeal!: OrderedMeal;
  private sub!: Subscription;
  private validationMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidator;

  constructor(private ordmealfb: FormBuilder, private router: Router, private menuservice: MenuService, private ordmealservice: OrderedMealService, private paymentservice: PaymentService, private encdecservice: EncrDecrService) {

  }

  ngOnInit(): void {

    this.orderedMealForm = this.ordmealfb.group({
      guest: new FormControl(''),
      // Amount: ['', Validators.required,Validators.minLength(3)]
      mealid: new FormControl(''),
      amount: new FormControl({ value: '', disabled: true })

    });
    // this.voucherForm=this.fb2.group({
    //   'id':[null]
    // })
    this.getMenus();
  }
  saveOrderedMeal(): void {

    if (this.orderedMealForm.valid) {
      if (this.orderedMealForm.dirty) {
        const p = { ...this.ordMeal, ...this.orderedMealForm.value };
        if (p.mealid !== 0) {
          p.dateEntered = new Date();
          p.enteredBy = "solaomotoso";
          if (confirm(`You are about to generate a ticket for Staff: ${p.guest}?`)) {
            this.ordmealservice.createOrder(p)
              .subscribe({
                next: () => this.onSaveComplete(),
                error: err => this.errorMessage = err
              });
          }
        } else {
          this.ordmealservice.updateOrder(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      }
      else {
        this.onSaveComplete();
      }
    }
    else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }
  getMenus() {
    this.menuservice.getMenus().subscribe(res => this.menus = res, error => this.errorMessage = <any>error);
  }

  onSaveComplete(): void {
    // this.registrationForm.reset();
    this.router.navigate(['/voucherdetails']);
  }
  onChange(value: any) {
    this.menuservice.getMenu(value.value).subscribe(res => {
      this.menu = res;
      if (this.menu !== undefined) {
        this.orderedMealForm.controls.amount.setValue(this.menu.amount);
      }
    }
    );

  }

}

