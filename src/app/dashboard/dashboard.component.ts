import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SocketioService } from '../services/socketio.service';
import { UserService } from '../services/user.service';
import { userInfo } from 'os';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pageTitle = 'Dashboard';
  role = ''; // change between waiter/chef/cashier/barman

  constructor(private sio: SocketioService, private us: UserService, private router: Router) {
    if (this.us.get_token() === '') {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.role = this.us.get_role();
  }
}
