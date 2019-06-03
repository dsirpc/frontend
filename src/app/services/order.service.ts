import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, throwError } from 'rxjs';
import { Order } from '../Order';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

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
        'Content-Type':  'application/json'
      }),
      params: new HttpParams( {fromObject: params} )
    };
  }

  get_orders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.us.url + '/order', this.create_options()).pipe(
      catchError( this.handleError )
    );
  }

  post_order(o: Order): Observable<Order> {
    return this.http.post<Order>(this.us.url + '/order', o, this.create_options()).pipe(
      catchError(this.handleError)
    );
  }

  order_delivered(o: Order, t: string): Observable<Order> {
    return this.http.post<Order>(this.us.url + '/order', o, this.create_options({type: t})).pipe(
      catchError(this.handleError)
    );
  }

  put_order(o: Order): Observable<Order> {
    return this.http.put<Order>(this.us.url + '/order', o, this.create_options()).pipe(
      catchError(this.handleError)
    );
  }
}
