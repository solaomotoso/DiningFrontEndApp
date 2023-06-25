import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Registration } from '../registration/registration.model';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { GenericValidator } from '../shared/generic-validator';
import { PaymentMode } from '../shared/PaymentMode.Model';
import { PaymentModeService } from '../shared/paymentmode.service';
import { Payment } from '../staffpayment/payment.model';
import { PaymentService } from '../staffpayment/payment.service';
import { Voucher } from '../voucher/voucher.model';
import { VoucherService } from '../voucher/voucher.service';

@Component({
  selector: 'app-outsourcedpayment',
  templateUrl: './outsourcedpayment.component.html',
  styleUrls: ['./outsourcedpayment.component.scss']
})
export class OutsourcedpaymentComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  pageTitle="New Outsourced Staff ticket"
  staffid=2;
  errorMessage= '';
  paymentForm!: FormGroup;
  paymentmodes!:PaymentMode[];
  vouchers!: Voucher[];
  payment!: Payment;
  public registration: Registration | undefined;
  private sub!: Subscription;
  private validationMessages!: { [key: string]: { [key: string]: string } };
  private genericValidator!: GenericValidator;

  constructor(private fboutsd: FormBuilder, private router: Router,private paymentmodeservice:PaymentModeService,private voucherservice:VoucherService, private paymentservice: PaymentService, private encdecservice:EncrDecrService) {

   }

  ngOnInit(): void {

      this.paymentForm = this.fboutsd.group({
        custCode: new FormControl('',[Validators.required,Validators.minLength(3)]),
        voucherId: new FormControl('',[Validators.required,Validators.min(1)]),
        paymentmodeid: new FormControl('',[Validators.required,Validators.min(1)])

      });
      // this.voucherForm=this.fb2.group({
      //   'id':[null]
      // })
      this.getVouchers();
      this.getpaymentmodes();
    }
    savePayment(): void {
      // console.log(this.registrationForm);
      // console.log('Saved: ' + JSON.stringify(this.registrationForm.value));
      if (this.paymentForm.valid) {
       if (this.paymentForm.dirty)
       {
          const p = { ...this.payment, ...this.paymentForm.value };
           if (p.custCode !== '') {
            var loggeinuser = localStorage.getItem('user');
            this.registration=loggeinuser !== null? JSON.parse(loggeinuser): new Registration();
            p.dateEntered=new Date();
            p.enteredBy=this.registration?.userName;
            p.custtypeid=2;
            p.servedby="";
            if (confirm(`You are about to generate meal ticket for Staff: ${p.custCode}?`))
            {
            this.paymentservice.createPayment(p)
             .subscribe({
               next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
            }
          } else if (p.custCode ===''){

            this.pageTitle="Enter Employee Code";
          }

        }
      }

       else {
         this.errorMessage = 'Please correct the validation errors.';
       }
      }
      getVouchers() {
        this.voucherservice.getVoucher(this.staffid).subscribe(res => this.vouchers = res, error => this.errorMessage = <any>error);
      }
      getpaymentmodes() {
        this.paymentmodeservice.getPaymentModes().subscribe(res => this.paymentmodes = res, error => this.errorMessage = <any>error);
      }

  onSaveComplete(): void {
    // this.registrationForm.reset();
    this.router.navigate(['/voucherdetails']);
     }
   }

