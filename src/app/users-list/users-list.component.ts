import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] = [];

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

  public delete_user(username) {
    this.us.delete_user(username).subscribe(() => {
      this.get_users();
    });
  }

}
