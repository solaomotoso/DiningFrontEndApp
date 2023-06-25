import { Component, OnInit } from '@angular/core';
import { PaymentDetail } from './paymentdetail.model';
import { PaymentDetailService } from './paymentdetail.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  pageTitle = 'Vouchers';
  errorMessage = '';
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredPaymentDetails = this.listFilter ? this.performFilter(this.listFilter) : this.paymentDetails;
  }

  filteredPaymentDetails: PaymentDetail[] = [];
  paymentDetails: PaymentDetail[] = [];

  constructor(private paymentdetailService: PaymentDetailService, private router: Router) { }

  performFilter(filterBy: string): PaymentDetail[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.paymentDetails.filter((pymtdetail: PaymentDetail) =>
    pymtdetail.custCode.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.paymentdetailService.getPaymentDetails().subscribe(
      (pymtdetails:PaymentDetail[])=>
      {
        this.paymentDetails = pymtdetails;
        this.filteredPaymentDetails = this.paymentDetails;
    });
  }

  updatepayment(pymtdetail: PaymentDetail): void {
    if (pymtdetail.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`You are about serving Customer: ${pymtdetail.custCode} meal`)) {
        pymtdetail.served=true;
        pymtdetail.servedby="solaomotoso";
        pymtdetail.dateserved=new Date();
        this.paymentdetailService.updatePaymentDetails(pymtdetail)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  onSaveComplete(): void {
    // this.registrationForm.reset();
    //this.router.navigate(['/voucher']);
   this.ngOnInit();
  };
     }


