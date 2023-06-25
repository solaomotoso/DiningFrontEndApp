import { Injectable } from '@angular/core';
import { Menu } from './menu.model';
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class MenuService {

  private menuURL = "https://localhost:7146/Menu";
  // private userURL1 = "http://localhost:5057/";
  private menu = Menu;
  //private handleError="";

  constructor(private http: HttpClient) { }

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.menuURL)
    // .pipe(
    //   tap(data => this.getUserdata(data)),
    //   catchError(this.handleError)
    // );
  }

  getMenu(id: number): Observable<Menu> {
    if (id === 0) {
      return of(this.initializeMenu());
    }
    const url = `${this.menuURL}/${id}`;
    return this.http.get<Menu>(url)
      .pipe(
        tap(data => console.log('getMenu: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
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



  private initializeMenu(): Menu {
    return {
      id: 0,
      name: "",
      amount:0,
    };
  }

}



