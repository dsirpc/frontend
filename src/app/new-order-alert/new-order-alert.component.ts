import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { SocketioService } from '../services/socketio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-order-alert',
  templateUrl: './new-order-alert.component.html',
  styleUrls: ['./new-order-alert.component.css']
})
export class NewOrderAlertComponent implements OnInit {

  private foodOrdersReady = [];
  private drinkOrdersReady = [];
  private username: string;

  constructor(private os: OrderService, private us: UserService, private sio: SocketioService, private router: Router) { }

  ngOnInit() {
    this.username = this.us.get_username();
    this.get_orders_ready();
    this.sio.connect();
    this.sio.onOrderFoodCompleted().subscribe((o) => {
      this.get_orders_ready();
    });
  }

  public get_orders_ready() {
    this.os.get_orders().subscribe((orders) => {
      for (const o of orders) {
        if (o.waiter === this.username) {
          if (o.food_status === 2) {
            this.foodOrdersReady.push(o);
          }
          if (o.drink_status) {
            this.drinkOrdersReady.push(o);
          }
        }
      }
      this.router.navigateByUrl('/dashboard');
    });
  }

  public food_order_delivered(order) {
    for (const o of this.foodOrdersReady) {
      if (order._id === o._id) {
        const i = this.foodOrdersReady.indexOf(o);
        this.foodOrdersReady.splice(i, 1);
        this.os.order_delivered(order, 'food').subscribe((or) => {
          this.get_orders_ready();
        });
      }
    }
    this.router.navigateByUrl('/dashboard');
  }

  public drink_order_delivered(order) {
    for (const o of this.foodOrdersReady) {
      if (order._id === o._id) {
        const i = this.drinkOrdersReady.indexOf(o);
        this.drinkOrdersReady.splice(i, 1);
        this.os.order_delivered(order, 'drink').subscribe((or) => {
          this.get_orders_ready();
        });
      }
    }
    this.router.navigateByUrl('/dashboard');
  }
}
