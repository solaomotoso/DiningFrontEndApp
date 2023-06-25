import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { Registration } from './registration.model';
import { RegistrationService } from './registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ConfirmPasswordValidator } from '../shared/confirm-password.validator';
import { customerType } from '../shared/customertype.model';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  customerTypes: customerType[] = []; // Array to store customer types
  registration: Registration=new Registration;
  errorMessage: string | undefined;
  pageTitle = 'New User';
  submitted: boolean = false;
  public loadedRegistration: Registration | undefined;
  private validationMessages: { [key: string]: { [key: string]: string } };


  constructor(private fb: FormBuilder, private router: Router, private registrationservice: RegistrationService, private encdecservice:EncrDecrService) {

    // Defines all of the validation messages for the form.
    //These could instead be retrieved from a file or database.

    this.validationMessages = {
      firstName: {
        required: 'first name is required.',
        minlength: 'First name must be at least three characters.'
      },
      lastName: {
        required: 'last name is required.'
      },
      email: {
        required: 'user name is required.'
      },
      password: {
        required: 'Password is required.'
      },

    };


   }

  ngOnInit(){
    this.registrationForm=this.fb.group({
      custTypeId: ['', Validators.required],
      custId: ['', [Validators.required]],
      firstName:['',[Validators.minLength(3)]],
      lastName:['',[Validators.maxLength(50)]],
      userName:['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password:['',[Validators.required]],
      confirmPassword:['',[Validators.required]]
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    }
    );
    this.loadCustomerTypes(); 
  }
  get regEmail(){
    return this.registrationForm.get('userName')
  }

  loadCustomerTypes() {
    this.registrationservice.getCustType().subscribe(
      (customerTypes: customerType[]) => {
        this.customerTypes = customerTypes;
        // console.log('Customer Types:', this.customerTypes);
      },
      (error: any) => {
        console.error('Error occurred while fetching customer types:', error);
      }
    );
  }
  getCustomerTypes(): string[] {
    return ['staff', 'outsourced', 'guest'];
  }
   
//   setPatternValidator(){
//     this.registrationForm.get('email')?.setValidators(Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"));  
// }
// emailValidator(control: { value: string; }) {
//   if (control.value) {
//     const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
//     return matches ? null : { 'invalidEmail': true };
//   } else {
//     return null;
//   }
// }
  save(): void {
    this.submitted=true;
   
    if (this.registrationForm.valid) {
     if (this.registrationForm.dirty) {
        const p = { ...this.registration, ...this.registrationForm.value };
        p.password=this.encdecservice.set('123456$#@$^@1ERF', p.password);
         if (p.userName!==""){
          this.registrationservice.getUserbyusername(p.userName)
          .subscribe((rslt:Registration)=>{
            this.loadedRegistration=rslt;
            if(this.loadedRegistration==null)
            {
              if (p.id === 0) {
          if (confirm(`You are about creating account for user: ${p.firstName+' '+p.lastName}?`)) {
          this.registrationservice.createUser(p)
           .subscribe({
             next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        }
        } 
       }
      }
    )
         
        }
      else {
       this.onSaveComplete();
      }
     } 
     else {
       this.errorMessage = 'Please correct the validation errors.';
     }
    }
  }

    getUser(username: string): Registration {
      this.registrationservice.getUserbyusername(username)
        .subscribe({
          next: (registration: Registration) => this.registration,
          error: err => this.errorMessage = err
        });
        return this.registration
    }
   
onSaveComplete(): void {
  // this.registrationForm.reset();
  this.router.navigate(['/registrations']);
   }
 }


