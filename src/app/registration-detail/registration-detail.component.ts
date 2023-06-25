import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Registration } from '../registration/registration.model';
import { RegistrationService } from '../registration/registration.service';

@Component({
  selector: 'app-registration-detail',
  templateUrl: './registration-detail.component.html',
  styleUrls: ['./registration-detail.component.scss']
})
export class RegistrationDetailComponent implements OnInit {

  pageTitle = 'Registration Detail';
  errorMessage = '';
  registration: Registration | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private registrationService: RegistrationService) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getUser(id);
    }
  }

  getUser(id: number): void {
    this.registrationService.getUser(id).subscribe({
      next: registration => this.registration = registration,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/Registration']);
  }


}
