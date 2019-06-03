import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { Order } from '../Order';
import { DishService } from '../services/dish.service';
import { Dish } from '../Dish';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-orders',
  templateUrl: './dashboard-orders.component.html',
  styleUrls: ['./dashboard-orders.component.css']
})
export class DashboardOrdersComponent implements OnInit {

  @Input()
  private testOrders;
  private orders: Order[] = [];
  private dishes: Dish[] = [];

  constructor(private os: OrderService, private us: UserService, private ds: DishService, private router: Router) { }

  ngOnInit() {
    this.get_orders();
    this.get_dishes();
  }


  get_orders() {
    this.os.get_orders().subscribe(
      (orders) => {
        for (const order of orders) {
          if (order.status === 0) {
            this.orders.push(order);
            this.sortOrder(order);
          }
        }
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_orders();
        },
        (err2) => {
          this.us.logout();
        });
      }
    );
  }

  get_dishes() {
    this.ds.get_dishes().subscribe(
      (dishes) => { this.dishes = dishes; },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_dishes();
        },
        (err2) => {
          this.us.logout();
        });
      }
    );
  }

  public sortOrder(order) {
    for (let i = 0; i < order.food.length - 1; i++ ) {
      for (let j = 0; j < order.food.length; j++ ) {
        if (order.dishes[i].estimated_time > order.dishes[j].estimated_time ) {
          const temp = order.dishes[j];
          order.dishes[j] = order.dishes[i];
          order.dishes[i] = temp;
        }
      }
    }
  }

  public loadOrderPage(orderId: string) {
    this.router.navigateByUrl('order/' + orderId);
  }

  public executeOrderTime(order) {
    let time = 0;
    for (const food of order.food) {
      for (const dish of this.dishes) {
        if (food === dish.name) {
          time += dish.estimated_time;
        }
      }
    }
    return time;
  }


}
