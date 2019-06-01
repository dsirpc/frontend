import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { UserService } from '../user.service';
import { SocketioService } from '../socketio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-order-alert',
  templateUrl: './new-order-alert.component.html',
  styleUrls: ['./new-order-alert.component.css']
})
export class NewOrderAlertComponent implements OnInit {

  private ordersReady = [];
  private username: string;

  constructor(private os: OrderService, private us: UserService, private sio: SocketioService, private router: Router) { }

  ngOnInit() {
    this.username = this.us.get_username();
    this.get_orders_ready();
    this.sio.connect();
    this.sio.onOrderCompleted().subscribe((o) => {
      this.get_orders_ready();
    });
  }

  public get_orders_ready() {
    this.os.get_orders_status(2).subscribe((orders) => {
      for (const o of orders) {
        if (o.waiter === this.username) {
          this.ordersReady.push(o);
        }
      }
      this.router.navigateByUrl('/dashboard');
    });
  }

  public order_delivered(order) {
    for (const o of this.ordersReady) {
      if (order._id === o._id) {
        const i = this.ordersReady.indexOf(o);
        this.ordersReady.splice(i, 1);
        this.os.put_order(order).subscribe((or) => {
          this.get_orders_ready();
        });
      }
    }
    this.router.navigateByUrl('/dashboard');
  }
}
