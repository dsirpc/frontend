import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  roles = ['Cassiere', 'Cuoco', 'Barman', 'Cameriere'];
  users = [];
  user = {username: '', password: '', role: ''};

  constructor(private us: UserService, private router: Router) { }

  ngOnInit() {
    this.get_users();
  }

  public get_users() {
    this.us.get_users().subscribe((users) => {
      this.users = users;
    },
    (err) => {
      this.us.renew().subscribe(() => {
        this.get_users();
      },
      (err2) => {
        this.us.logout();
      });
    });
  }

  public user_changed(user) {
    (document.getElementById('user') as HTMLInputElement).value = user;
  }

  public password_changed(pwd) {
    (document.getElementById('pwd') as HTMLInputElement).value = pwd;
  }

  public create_user() {
    const username = (document.getElementById('user') as HTMLInputElement).value;
    if (username === '') {
      window.alert('Username mancante!');
      return;
    }

    const password = (document.getElementById('pwd') as HTMLInputElement).value;
    if (password === '') {
      window.alert('Password mancante!');
      return;
    }

    const role = (document.getElementById('user') as HTMLSelectElement).value;
    if (role === 'Ruolo') {
      window.alert('Ruolo mancante!');
      return;
    }

    for (const user of this.users) {
      if (user.username === username) {
        window.alert('Username già esistente');
        return;
      }
    }

    this.user.username = username;
    this.user.password = password;
    switch (role) {
      case 'Cassiere':
        this.user.role = 'CASHER';
        break;

      case 'Cameriere':
        this.user.role = 'WAITER';
        break;

      case 'Cuoco':
        this.user.role = 'CHEF';
        break;

      case 'Barman':
        this.user.role = 'BARMAN';
        break;
    }

    this.us.register(this.user).subscribe((user) => {
      this.get_users();
      this.router.navigateByUrl('/dashboard');
    });
  }
}
