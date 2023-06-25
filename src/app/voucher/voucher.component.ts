import { Component, OnInit } from '@angular/core';
import { Voucher } from './voucher.model';
import { VoucherService } from './voucher.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {

  pageTitle='Vouchers';
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredVouchers = this.listFilter ? this.performFilter(this.listFilter) : this.vouchers;
  }

  filteredVouchers: Voucher[] = [];
  vouchers: Voucher[] = [];

  constructor( private voucherService:VoucherService) { }

  performFilter(filterBy: string): Voucher[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.vouchers.filter((voucher: Voucher) =>
    voucher.description.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  // calcStyles(custtypeid:number) {
  //   if(custtypeid==1) {
  //     return "Staff"
  //   }
  //   else if (custtypeid==2)
  //    { return "Outsourced"}

  //    else
  //    return "Guest"

  // }

  ngOnInit(): void {
    this.voucherService.getVouchers().subscribe(
      (vouchers:Voucher[])=>
      {
        this.vouchers = vouchers;
        this.filteredVouchers = this.vouchers;
    });
  }
}
