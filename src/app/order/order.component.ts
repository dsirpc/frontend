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
  private order: Order;
  private dishes: Dish[] = [];
  private orderId: string;
  private count = 0;

  constructor(private os: OrderService, private us: UserService, private ds: DishService, private router: Router, private route: ActivatedRoute) {
    if (this.us.get_token() === '') {
      this.router.navigateByUrl('/login');
      }
  }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.get_orders();
    this.get_dishes();
  }

  get_orders() {
    this.os.get_orders().subscribe(
      (orders) => {
        for (const order of orders) {
          if (order._id === this.orderId) {
            this.order = order;
            this.sortOrderFood(order);
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

  public sortOrderFood(order) {
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

  FoodReady(order, i) {
    this.os.put_order(order).subscribe((o) => {
      (document.getElementsByName('ckFood')[i] as HTMLInputElement).disabled = true;
      this.checkOrderCompleted(order);
    });
  }

  checkOrderCompleted(order) {
    this.count++;
    if ( this.count === this.order.food.length) {
      this.os.put_order(order).subscribe((o) => {
        this.router.navigateByUrl('/dashboard');
      });
    }
  }

  startOrder(order) {
    this.os.put_order(order).subscribe((o) => {});
    (document.getElementById('btnStart') as HTMLButtonElement).disabled = true;
  }
}
