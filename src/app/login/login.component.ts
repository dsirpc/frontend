import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/*
@Component({
  selector: 'user-login',
  template: `<button (click)="onClickMe()">Sign in</button>`,
})*/

export class LoginComponent implements OnInit, AfterViewInit {

  private errmessage = undefined;
  constructor(private us: UserService, private router: Router, private elementRef: ElementRef) { }

  ngOnInit() {
    this.us.renew().subscribe((d) => {
      console.log('Renew succeded: ' + JSON.stringify(d));
      this.router.navigate(['/dashboard']);
    }, (err) => {
      console.log('Renew error: ' + JSON.stringify(err.error.errormessage));
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#f5f5f5';
  }

  login(username: string, password: string, remember: boolean) {
    this.us.login(username, password, remember).subscribe((d) => {
      console.log('Login granted: ' + JSON.stringify(d));
      console.log('User service token: ' + this.us.get_token());
      this.errmessage = undefined;
      this.router.navigate(['/dashboard']);
    }, (err) => {
      console.log('Login error: ' + JSON.stringify(err.error.errormessage));
      this.errmessage = err.error.errormessage;
    });
  }
}
