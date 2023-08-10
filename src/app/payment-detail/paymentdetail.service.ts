import { Injectable } from '@angular/core';
import { PaymentDetail } from './paymentdetail.model';
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { EnvironmentUrlService } from '../shared/services/environment-url.service';

@Injectable({
  providedIn: 'root'
})

export class PaymentDetailService {

  private PaymentDetailURL = "https://localhost:7146/paymentDetails";
  private PaymentmainURL = "https://localhost:7146/paymentmain";
  private paymentdetail = PaymentDetail;

  constructor(private http: HttpClient,  private envUrl: EnvironmentUrlService) { }

  getPaymentDetails(): Observable<PaymentDetail[]> {
    return this.http.get<PaymentDetail[]>(this.envUrl.urlAddress)
  }
  getPaginatedData(page: number, pageSize: number):Observable<PaymentDetail[]> {
    return this.http.get<PaymentDetail[]>(`${this.envUrl.urlAddress}?page=${page}&pageSize=${pageSize}`);
  }

  getPaymentDetailsByUserId(userId: number): Observable<PaymentDetail[]> {
    const url = `${this.envUrl.urlAddress}/PaymentDetails/${userId}`;
    return this.http.get<PaymentDetail[]>(url)
  }


  getPymtdetailsdata(data: PaymentDetail[]) {
    console.log(JSON.stringify(data))
  }

 
  updatePaymentDetails(paymentdetail: PaymentDetail): Observable<PaymentDetail> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.PaymentmainURL}/${paymentdetail.id}`;
    return this.http.put<PaymentDetail>(url, paymentdetail, { headers })
      .pipe(
        tap(() => console.log('updatePaymentDetail: ' + paymentdetail.id)),
        map(() => paymentdetail),
        catchError(this.handleError)
      );
  }

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

}



