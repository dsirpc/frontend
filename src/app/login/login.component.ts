import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { location } from '../app.component';

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

export class LoginComponent implements OnInit {

  private errmessage = undefined;
  constructor(private us: UserService, private router: Router) { }

  ngOnInit() {
    this.us.renew().subscribe((d) => {
      this.router.navigateByUrl('/dashboard');
    }, (err) => {
      console.log('Renew error: ' + JSON.stringify(err.error.errormessage));
    });
  }

  login(username: string, password: string, remember: boolean) {
    this.us.login(username, password, remember).subscribe((d) => {
      this.errmessage = undefined;
      this.router.navigate(['/dashboard']);
    }, (err) => {
      console.log('Login error: ' + JSON.stringify(err.error.errormessage));
      this.errmessage = err.error.errormessage;
      window.alert('Credenziali errate');
    });
  }
}
