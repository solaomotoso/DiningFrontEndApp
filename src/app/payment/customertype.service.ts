import { Injectable } from '@angular/core';
import { CustomerType} from './customertype.model';
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ServiceUrl } from '../shared/serviceurl.model';

@Injectable({
  providedIn: 'root'
})

export class RegistrationService {

  // private ctypeURL = "https://localhost:7146/customertype";
  private custttype = CustomerType;
  // serviceUrl:ServiceUrl|undefined;
  private ctypeURL =ServiceUrl.url+"customertype"
  constructor(private http: HttpClient) { }

  getCustType(): Observable<CustomerType[]> {
    return this.http.get<CustomerType[]>(this.ctypeURL)
    // .pipe(
    //   tap(data => this.getUserdata(data)),
    //   catchError(this.handleError)
    // );
  }



  private initializeCustType(): CustomerType {
    return {
      id: 0,
      Name: "",
    };
  }

}



