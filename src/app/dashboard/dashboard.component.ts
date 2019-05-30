import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private pageTitle = 'Dashboard';
  private role = 'waiter'; // change between waiter/chef/cashier/barman
  private testTables = [
    {
      number: 1,
      status: 'free'
    },
    {
      number: 2,
      status: 'free'
    }
  ];
  private testOrders = [
    {
      plate: 'Pasta',
      table: 2,
      status: 'todo'
    },
    {
      plate: 'Pizza',
      table: 2,
      status: 'done'
    }
  ];

  constructor(private sio: SocketioService) {
    // this.role = NavbarComponent.getRole();
  }

  ngOnInit() { }
}
