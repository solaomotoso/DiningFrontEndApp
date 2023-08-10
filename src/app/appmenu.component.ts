import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { Registration } from './registration/registration.model';
import {Route} from './shared/route.model';
import { RegistrationService } from './registration/registration.service';

@Component({
    selector: 'app-menu',
    templateUrl: './appmenu.component.html',
    styleUrls: ['./appmenu.component.scss'],
  })
  export class AppMenuComponent implements OnInit{
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    isLoggedIn$!: Observable<boolean>;
   
    loggedinUser = ' ';
    registration: Registration | undefined;
    route!: Route[];
  
  
    constructor(private observer: BreakpointObserver, private router: Router, public authService: AuthService,public regservice: RegistrationService) { }
  
      ngOnInit() {
       
      this.isLoggedIn$ = this.authService.isLoggedIn;
      this.sidenav.mode='side';
      this.isLoggedIn$.subscribe((rslt: any) => {
      if(this.isLoggedIn$!==undefined)
      {
      this.registration= JSON.parse(localStorage.getItem('user')|| '[]');
      if (this.registration){
      this.regservice.getRoles(this.registration).subscribe(
        (roless: Route[]) => {
          this.route = roless;
          // this.filteredPaymentDetails = this.paymentDetails;
        });
      }
    
      if(this.registration!=undefined && this.registration.firstName!=undefined)
      {
        this.loggedinUser='Welcome: '+this.registration?.firstName+' '+this.registration?.lastName;
      }
      else{
        this.loggedinUser='';
      }
    }
  }
  
  );
  
  }
    onLogout() {
      this.authService.logout();
      localStorage.removeItem('user');
      this.loggedinUser='';
      this.isLoggedIn$=this.authService.isLoggedIn;
  
    }
  
    ngAfterViewInit() {
      this.observer
        .observe(['(max-width: 800px)'])
         .pipe(delay(1), untilDestroyed(this))
        .subscribe((res) => {
           if (this.sidenav) {
            if (res.matches) {
              this.sidenav.mode = 'over';
              this.sidenav.close();
            } else {
              this.sidenav.mode = 'side';
              this.sidenav.open();
            }
           }
  
        });
  
      this.router.events
        .pipe(
          untilDestroyed(this),
          filter((e) => e instanceof NavigationEnd)
        )
        .subscribe(() => {
          if (this.sidenav?.mode === 'over') {
            this.sidenav?.close();
          }
        });
    }
  }