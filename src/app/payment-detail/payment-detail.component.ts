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
  dataSource: any[] = [];
  pageSize = 10;
  totalItems = 0;

  constructor(private paymentdetailService: PaymentDetailService, private router: Router) { }

  performFilter(filterBy: string): PaymentDetail[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.paymentDetails.filter((pymtdetail: PaymentDetail) =>
    pymtdetail.custCode.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.loadData(10);
    // this.paymentdetailService.getPaymentDetails().subscribe(
    //   (pymtdetails:PaymentDetail[])=>
    //   {
    //     this.paymentDetails = pymtdetails;
    //     this.filteredPaymentDetails = this.paymentDetails;
    // });
  }
  loadData(page: number) {
    this.paymentdetailService.getPaginatedData(page, this.pageSize).subscribe(
      (pymtdetails:PaymentDetail[]) => {
        this.paymentDetails = pymtdetails;
        this.dataSource=pymtdetails; // Assuming your backend response has a property 'items' that holds the data array
        this.totalItems = pymtdetails.length; // Assuming your backend response has a property 'totalItems' that holds the total number of items
      },
      // error => {
      //   console.error('Error fetching data:', error);
      // }
    );
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


