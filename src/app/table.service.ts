import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Table } from './Table';

@Injectable({
  providedIn: 'root'
})

export class TableService {

  constructor(private http: HttpClient, private us: UserService) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }
    // return an ErrorObservable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private create_options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( {fromObject: params} )
    };
  }

  get_tables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.us.url + '/table').pipe(
      tap( (data) => console.log(JSON.stringify(data))) ,
      catchError( this.handleError )
    );
  }

  post_table(t: Table): Observable<Table> {
    return this.http.post<Table>(this.us.url + '/table', t, this.create_options()).pipe(
      catchError(this.handleError)
    );
  }

  put_table(t: Table): Observable<Table> {
    return this.http.put<Table>(this.us.url + '/table', t, this.create_options()).pipe(
      catchError(this.handleError)
    );
  }
}
