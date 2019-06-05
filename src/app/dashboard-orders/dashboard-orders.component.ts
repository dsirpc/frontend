import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { Order } from '../Order';
import { DishService } from '../services/dish.service';
import { Dish } from '../Dish';
import { Router } from '@angular/router';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-dashboard-orders',
  templateUrl: './dashboard-orders.component.html',
  styleUrls: ['./dashboard-orders.component.css']
})
export class DashboardOrdersComponent implements OnInit {

  foodOrders: Order[] = [];
  drinkOrders: Order[] = [];
  suspendedFoodOrders: Order[] = [];
  suspendedDrinkOrders: Order[] = [];
  dishes: Dish[] = [];
  drinks: Dish[] = [];
  role = ''; // change between waiter/chef/cashier/barman

  constructor(private os: OrderService, private us: UserService, private ds: DishService, private router: Router, private sio: SocketioService) { }

  ngOnInit() {
    this.role = this.us.get_role();
    this.get_orders();
    this.get_dishes();
    this.sio.connect();
    this.sio.onOrderSent().subscribe((o) => {
      this.get_orders();
    });
    if (this.role === 'CHEF') {
      this.sio.onOrderFoodStarted().subscribe((o) => {
        this.get_orders();
      });
    }
    if (this.role === 'BARMAN') {
      this.sio.onOrderDrinkStarted().subscribe((o) => {
        this.get_orders();
      });
    }
  }


  public get_orders() {
    this.os.get_orders().subscribe(
      (orders) => {
        for (const order of orders) {
          if (this.role === 'CHEF') {
            if (order.food_status === 0) {
              this.foodOrders.push(order);
            } else {
              if (order.food_status === 1 && order.chef === this.us.get_username()) {
                this.suspendedFoodOrders.push(order);
              }
            }
          }
          if (this.role === 'BARMAN') {
            if (order.drink_status === 0 && order.drinks.length > 0) {
              this.drinkOrders.push(order);
            } else {
              if (order.drink_status === 1 && order.barman === this.us.get_username()) {
                this.suspendedDrinkOrders.push(order);
              }
            }
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
      });
  }

  public get_dishes() {
    this.ds.get_dishes().subscribe(
      (dishes) => {
        this.dishes = dishes;
      },
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

