import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { Voucher } from '../voucher/voucher.model';
import { VoucherService } from '../voucher/voucher.service';
import { CustomerType } from './customertype.model';
import { CustomerTypeService } from './customertype.service';

@Component({
  selector: 'app-voucher-new',
  templateUrl: './voucher-new.component.html',
  styleUrls: ['./voucher-new.component.scss']
})
export class VoucherNewComponent implements OnInit {

  voucherForm!: FormGroup;
  voucher: Voucher=new Voucher;
  errorMessage: string | undefined;
  vouchers!: Voucher[];
  customertypes!: CustomerType[];
  pageTitle = 'New Voucher';
  private validationMessages: { [key: string]: { [key: string]: string } };


  constructor(private fb: FormBuilder, private router: Router, private voucherservice: VoucherService,private customertypeservice:CustomerTypeService, private encdecservice:EncrDecrService) {
    this.validationMessages = {
      custTypeId: {
        required: 'Customer Type is required.',
      },
      description: {
        required: 'Description is required.'
      },
      amount: {
        required: 'Amount is required.'
      },

    };

   }

   ngOnInit(){
    this.voucherForm=this.fb.group({
      // cutomerType:['',[Validators.required,Validators.minLength(3)]],
      // description:['',[Validators.required,Validators.maxLength(50)]],
      // amount:['',[Validators.required,Validators.maxLength(50)]],
      custtypeid: new FormControl(''),
      description: new FormControl(''),
      amount: new FormControl(''),

    });
    this.getCustomerTypes();
  }

  save(): void {

    if (this.voucherForm.valid) {
     if (this.voucherForm.dirty) {
        const p = { ...this.voucher, ...this.voucherForm.value };
         if (p.id === 0) {
          if (confirm(`You are about creating a new voucher: ${p.description}?`)) {
          this.voucherservice.createVoucher(p)
           .subscribe({
             next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        }
        } else {
         this.voucherservice.updateVoucher(p)
         .subscribe({
           next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
           });
       }
      } else {
       this.onSaveComplete();
      }
     } else {
       this.errorMessage = 'Please correct the validation errors.';
     }
    }
    getCustomerTypes() {
      this.customertypeservice.getCustomerTypes().subscribe(res => this.customertypes = res, error => this.errorMessage = <any>error);
    }

onSaveComplete(): void {
  // this.registrationForm.reset();
  this.router.navigate(['/voucher']);
   }
 }

