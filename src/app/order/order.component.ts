import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { Order } from '../Order';
import { DishService } from '../services/dish.service';
import { Dish } from '../Dish';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private os: OrderService, private us: UserService, private ds: DishService) { }

  ngOnInit() {
  }


  FoodReady(order) {
    this.os.put_order(order).subscribe((o) => {
      (document.getElementById('ckFood') as HTMLInputElement).disabled = true;
    });
  }
}
