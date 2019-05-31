import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SocketioService } from '../socketio.service';
import { UserService } from '../user.service';
import { userInfo } from 'os';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private pageTitle = 'Dashboard';
  private role = ''; // change between waiter/chef/cashier/barman

  constructor(private sio: SocketioService, private us: UserService) {}

  ngOnInit() {
    this.role = this.us.get_role();
  }
}
