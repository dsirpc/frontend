import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../User';
import { location } from '../app.component';
const jwtdecode = require('jwt-decode');

// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  public token = '';
  public url = 'https://dsirpc-api.herokuapp.com';
  // public url = 'http://localhost:8080';

  login(username: string, password: string, remember: boolean): Observable<any> {
    console.log('Login: ' + username + ' ' + password);
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(username + ':' + password),
        // 'cache-control': 'no-cache',
        // 'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.get(this.url + '/login', options).pipe(
      tap((data) => {
        this.token = data.token;
        if (remember) {
          localStorage.setItem('token', this.token);
        }
      })
    );
  }

  renew(): Observable<any> {
    const tk = localStorage.getItem('token');
    if (!tk || tk.length < 1) {
      return throwError({ error: { errormessage: 'No token found in local storage' } });
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + tk,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
      params: new HttpParams( {fromObject: {l: location}} )
    };

    console.log(location + ' user.service');

    return this.http.get(this.url + '/renew', options).pipe(
      tap((data) => {
        this.token = data.token;
        localStorage.setItem('token', this.token);
      })
    );
  }

  logout() {
    console.log('Logging out');
    this.token = '';
    localStorage.setItem('token', this.token);
    this.router.navigateByUrl('/login');
  }

  register(user): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.get_token(),
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

  get_users(): Observable<User[]> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.get_token(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.get<User[]>(this.url + '/user', options).pipe(
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

  get_role() {
    return jwtdecode(this.token).role;
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
