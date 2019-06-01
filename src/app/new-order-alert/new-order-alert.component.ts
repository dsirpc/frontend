import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-new-order-alert',
  templateUrl: './new-order-alert.component.html',
  styleUrls: ['./new-order-alert.component.css']
})
export class NewOrderAlertComponent implements OnInit {

  private ordersReady = [];
  private username: string;

  constructor(private os: OrderService, private us: UserService) { }

  ngOnInit() {
    this.username = this.us.get_username();
  }

  public get_orders_ready() {
    this.os.get_orders_status(2).subscribe((orders) => {
      for (const o of orders) {
        if (o.waiter === this.username) {
          this.ordersReady.push(o.table_number);
        }
      }
    });
  }
}
