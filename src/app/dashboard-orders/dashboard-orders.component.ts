import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../order.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard-orders',
  templateUrl: './dashboard-orders.component.html',
  styleUrls: ['./dashboard-orders.component.css']
})
export class DashboardOrdersComponent implements OnInit {

  @Input()
  private testOrders;

  constructor(private os: OrderService, private us: UserService) { }

  ngOnInit() {
    console.log(this.testOrders);
  }

}
