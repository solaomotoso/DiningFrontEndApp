import { HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Registration } from '../registration/registration.model';
import { RegistrationService } from '../registration/registration.service';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { GenericValidator } from '../shared/generic-validator';





@Component({
  selector: 'app-registration-edit',
  templateUrl: './registration-edit.component.html',
  styleUrls: ['./registration-edit.component.scss']
})
export class RegistrationEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];

  pageTitle = 'Registration Edit';
  errorMessage= '';
  registrationForm!: FormGroup;
  registration!: Registration;
  private sub!: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private registrationservice: RegistrationService,private encdecservice:EncrDecrService) {

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
      userName: {
        required: 'user name is required.'
      },
      password: {
        required: 'Password is required.'
      },

    };
     // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

     }

  ngOnInit(): void {

    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = + params.get('id')!;
        //params.get(String:'id');
        this.getUser(id);
      }
    );
    // let httpParams = new HttpParams().set('user', this.registration.id.toString());
    // httpParams.set('user', this.registration.id.toString());

    // let options = { params: httpParams };
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.registrationForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.registrationForm);
    });
  }

  getUser(id: number): void {
    this.registrationservice.getUser(id)
      .subscribe({
        next: (registration: Registration) => this.displayUser(registration),
        error: err => this.errorMessage = err
      });
  }

  displayUser(registration: Registration): void {
    if (this.registrationForm) {
      this.registrationForm.reset();
    }
    this.registration = registration;

    if (this.registration.id === 0) {
      this.pageTitle = 'Add User';
    } else {
      this.pageTitle = `Edit User: ${this.registration.firstName+' '+this.registration.lastName}`;
    }

    // Update the data on the form
    this.registrationForm.patchValue({
      firstName: this.registration.firstName,
      lastName: this.registration.lastName,
      userName: this.registration.userName,
      password: this.registration.password
    });
  }



  deleteUser(): void {
    if (this.registration.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the user: ${this.registration.firstName+' '+this.registration.lastName}?`)) {
        this.registrationservice.deleteUser(this.registration)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveUser(): void {
    if (this.registrationForm.valid) {
      if (this.registrationForm.dirty) {
        const p = { ...this.registration, ...this.registrationForm.value };
        p.password=this.encdecservice.set('123456$#@$^@1ERF', p.password);
        if (p.id === 0) {
          this.registrationservice.createUser(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.registrationservice.updateUser(p)
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

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.registrationForm.reset();
    this.router.navigate(['/registrations']);
  }

}
