import { Injectable } from '@angular/core';
import { CustomerType } from './customertype.model';
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CustomerTypeService {

  private URL = "https://localhost:7146/CustomerType";
  // private userURL1 = "http://localhost:5057/";
  private customertype = CustomerType;
  //private handleError="";

  constructor(private http: HttpClient) { }

  getCustomerTypes(): Observable<CustomerType[]> {
    return this.http.get<CustomerType[]>(this.URL)
    // .pipe(
    //   tap(data => this.getUserdata(data)),
    //   catchError(this.handleError)
    // );
  }

  getCustomerTypedata(data: CustomerType[]) {
    console.log(JSON.stringify(data))
  }

  // getVoucher(id: number): Observable<Voucher[]> {
  //   const url = `${this.voucherURL}/${id}`;
  //   return this.http.get<Voucher[]>(url)
  //     .pipe(
  //       tap(data => console.log('getVoucher: ' + JSON.stringify(data))),
  //       catchError(this.handleError)
  //     )
  // }

  // getUserbyusername(username: string): Observable<Registration> {

  //   const url = `${this.userURL}/getuser/${username}`;
  //   return this.http.get<Registration>(url)
  //     .pipe(
  //       tap(data => console.log('getUser: ' + JSON.stringify(data))),
  //       catchError(this.handleError)
  //     )
  // }

  // createVoucher(voucher: Voucher): Observable<Voucher> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   voucher.id = 0;
  //   return this.http.post<Voucher>(this.voucherURL, voucher, { headers })
  //     .pipe(
  //       tap(data => console.log('createVoucher: ' + JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }


  // deleteVoucher(vouch: Voucher): Observable<{}> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const url = `${this.voucherURL}/deletevoucher`;
  //   return this.http.post<Voucher>(url,vouch)
  //     .pipe(
  //       tap(data => console.log('deleteVoucher: ' + vouch.description)),
  //       catchError(this.handleError)
  //     );
  // }

  // updateVoucher(voucher: Voucher): Observable<Voucher> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const url = `${this.voucherURL}/${voucher.id}`;
  //   return this.http.put<Voucher>(url, voucher, { headers })
  //     .pipe(
  //       tap(() => console.log('updateVoucher: ' + voucher.id)),
  //       // Return the product on an update
  //       map(() => voucher),
  //       catchError(this.handleError)
  //     );
  // }

  private handleError(err: { error: { message: any; }; status: any; body: { error: any; }; }): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage!: string;
    if (err.error && err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status!}: ${err.body?.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }


  private initializeVoucher(): CustomerType {
    return {
      id: 0,
      name: "",
    };
  }

}



