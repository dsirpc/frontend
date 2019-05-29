import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
const jwtdecode = require('jwt-decode');

// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  public token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhbWVyaWVyZSIsInJvbGUiOiJXQUlURVIiLCJpYXQiOjE1NTg4NjQzODgsImV4cCI6MTU1ODg2Nzk4OH0.dcPnylnekCWSyMHWLKGBOvo9Pl26Gz0CWyXmro7lSZ0';
  public url = 'https://dsirpc-api.herokuapp.com/';

  login(username: string, password: string, remember: boolean): Observable<any> {

    console.log('Login: ' + username + ' ' + password);
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(username + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.get(this.url + '/login', options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
        this.token = data.token;
        if (remember) {
          localStorage.setItem('postmessages_token', this.token);
        }
      }));
  }

  renew(): Observable<any> {

    const tk = localStorage.getItem('postmessages_token');
    if (!tk || tk.length < 1) {
      return throwError({ error: { errormessage: 'No token found in local storage' } });
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + tk,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    console.log('Renewing token');
    return this.http.get(this.url + '/renew', options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
        this.token = data.token;
        localStorage.setItem('postmessages_token', this.token);
      }));
  }

  logout() {
    console.log('Logging out');
    this.token = '';
    localStorage.setItem('postmessages_token', this.token);
  }

  register(user): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(this.url + '/user', user, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
      })
    );

  }

  get_token() {
    return this.token;
  }

  get_username() {
    return jwtdecode(this.token).username;
  }

  is_casher(): boolean {
    const role = jwtdecode(this.token).role;
    return role === 'CASHER';
  }

  is_chef(): boolean {
    const role = jwtdecode(this.token).role;
    return role === 'CHEF';
  }

  is_waiter(): boolean {
    const role = jwtdecode(this.token).role;
    return role === 'WAITER';
  }

  is_barman(): boolean {
    const role = jwtdecode(this.token).role;
    return role === 'BARMAN';
  }
}
