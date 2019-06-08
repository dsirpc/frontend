import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { DishService } from '../services/dish.service';
import { Dish } from '../Dish';
import { Order } from '../Order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @Input()
  order: Order;
  dishes: Dish[] = [];
  drinks: Dish[] = [];
  orderId: string;
  role = ''; // change between waiter/chef/cashier/barman

  constructor(private os: OrderService, private us: UserService, private ds: DishService, private router: Router, private route: ActivatedRoute) {
    if (this.us.get_token() === '') {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.role = this.us.get_role();
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.get_order();
    this.get_dishes();
  }

  public get_order() {
    this.os.get_orders().subscribe(
      (orders) => {
        for (const order of orders) {
          if (order._id == this.orderId) {
            this.order = order;
            if (this.role === 'CHEF') {
              this.checkOrderCompleted(order);
            }
            return;
          }
        }
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_order();
        },
          (err2) => {
            this.us.logout();
          });
      }
    );
  }

  public get_dishes() {
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

  public startOrder(order) {
    this.os.put_order(order).subscribe((o) => {
      this.get_order();
    });
  }

  public getEstimatedTime(food) {
    for (const dish of this.dishes) {
      if (dish.name === food) {
        return dish.estimated_time;
      }
    }
  }

  public foodReady(order, i) {
    this.os.dish_completed(order, i).subscribe((o) => {
      this.get_order();
    });
  }

  public checkOrderCompleted(order) {
    let count = 0;
    for (const dish of order.food_ready) {
      if (dish) {
        count++;
      }
    }
    if (count === this.order.food.length) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  public endOrder(order) {
    this.os.put_order(order).subscribe((o) => {
      this.router.navigateByUrl('/dashboard');
    });
  }

}
