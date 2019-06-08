import { Component, OnInit, ElementRef, ViewChild, NgModule, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../services/table.service';
import { Table } from '../Table';
import { Order } from '../Order';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import { Dish } from '../Dish';
import { DishService } from '../services/dish.service';
import { FormsModule } from '@angular/forms';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})

@NgModule({
  imports: [
    FormsModule
  ]
})
export class TablesComponent implements OnInit {

  tableNumber: number; // id table (get from url)
  table: Table;
  orders: Order[] = [];
  food: Dish[] = [];
  drinks: Dish[] = [];
  dishes: Dish[] = [];
  uniqueDishOrders = [];
  foodRows = [0];
  drinksRows = [0];
  ots: Order;
  role: string;
  pay = false;

  constructor(private route: ActivatedRoute,
              private ts: TableService,
              private router: Router,
              private us: UserService,
              private os: OrderService,
              private ds: DishService,
              private sio: SocketioService) {
                if (this.us.get_token() === '') {
                  this.router.navigateByUrl('/login');
                }
  }

  ngOnInit() {
    this.tableNumber = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.get_table();
    this.get_orders();
    this.get_dishes();
    this.set_empty();
    this.role = this.us.get_role();
    if (this.role === 'CASHER') {
      this.sio.connect();
      this.sio.onOrderSent().subscribe((o) => {
        this.get_orders();
      });
      this.sio.onOrderFoodStarted().subscribe((o) => {
        this.get_orders();
      });
      this.sio.onDishCompleted().subscribe((o) => {
        this.get_orders();
      });
      this.sio.onOrderFoodCompleted().subscribe((o) => {
        this.get_orders();
      });
      this.sio.onOrderDrinkDelivered().subscribe((o) => {
        this.get_orders();
      });
      this.sio.onOrderFoodDelivered().subscribe((o) => {
        this.get_orders();
      });
    }
  }

  set_empty() {
    this.ots = {
      _id: '0',
      table_number: this.tableNumber,
      food: [],
      drinks: [],
      food_ready: [],
      chef: '',
      waiter: '',
      barman: '',
      food_status: 0,
      drink_status: 0,
      payed: false,
      timestamp: new Date()
    };
  }

  public get_table() {
    this.ts.get_tables().subscribe(
      (tables) => {
        for (const t of tables) {
          if (t.number_id === this.tableNumber) {
            this.table = t;
          }
        }
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_table();
        },
          (err2) => {
            this.us.logout();
          });
      }
    );
  }

  public get_orders() {
    this.os.get_orders().subscribe(
      (orders) => {
        this.orders = [];
        let count = 0;
        let f = false;
        let d = false;
        for (const o of orders) {
          if (o.table_number === this.tableNumber && !o.payed) {
            this.orders.push(o);
            f = (o.food.length > 0 && o.food_status === 3) || (o.food.length === 0 && o.food_status === 0);
            d = (o.drinks.length > 0 && o.drink_status === 3) || (o.drinks.length === 0 && o.drink_status === 0);
            if (f && d) {
              count++;
            }
          }
        }
        if (count === this.orders.length) {
          this.pay = true;
        }
        this.delete_dish_duplicate();
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

  public get_dishes() {
    this.ds.get_dishes().subscribe(
      (dishes) => {
        this.dishes = dishes;
        for (const d of dishes) {
          if (d.type === 'food') {
            this.food.push(d);
          } else {
            if (d.type === 'drink') {
              this.drinks.push(d);
            }
          }
        }
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

  public delete_dish_duplicate() {
    this.uniqueDishOrders = [];
    for (const o of this.orders) {
      const order = { id: o._id, food: [], food_qt: [], drinks: [], drink_qt: [], food_status: o.food_status, n_food_completed: 0, n_total_food: o.food.length, waiter: o.waiter };
      for (const d of o.food) {
        if (o.food_ready[o.food.indexOf(d)]) {
          order.n_food_completed++;
        }
        const fqt = 1;
        if (!order.food.includes(d)) {
          order.food.push(d);
          order.food_qt.push(fqt);
        } else {
          const i = order.food.indexOf(d);
          order.food_qt[i] += 1;
        }
      }

      for (const d of o.drinks) {
        const dqt = 1;
        if (!order.drinks.includes(d)) {
          order.drinks.push(d);
          order.drink_qt.push(dqt);
        } else {
          const i = order.drinks.indexOf(d);
          order.drink_qt[i] += 1;
        }
      }

      this.uniqueDishOrders.push(order);
    }
  }

  // FUNZIONI DISPLAY ORDINI ESISTENTI
  public getDishPrice(food) {
    for (const d of this.food) {
      if (d.name === food) {
        return d.price;
      }
    }
  }

  public getDishQuantity(order, food) {
    for (const o of this.uniqueDishOrders) {
      if (o.id == order) {
        return o.food_qt[o.food.indexOf(food)];
      }
    }
  }

  public getDrinkPrice(drink) {
    for (const d of this.drinks) {
      if (d.name === drink) {
        return d.price;
      }
    }
  }

  public getDrinkQuantity(order, drink) {
    for (const o of this.uniqueDishOrders) {
      if (o.id == order) {
        return o.drink_qt[o.drinks.indexOf(drink)];
      }
    }
  }

  // FUNZIONI NUOVO ORDINE CIBI
  public increase_food_qt(row) {
    let qt = parseInt((document.getElementById('quantity-food-' + row) as HTMLInputElement).value, 10);
    qt++;
    (document.getElementById('quantity-food-' + row) as HTMLInputElement).value = '' + qt;
  }

  public decrease_food_qt(row) {
    let qt = parseInt((document.getElementById('quantity-food-' + row) as HTMLInputElement).value, 10);
    if (qt > 0) {
      qt--;
      (document.getElementById('quantity-food-' + row) as HTMLInputElement).value = '' + qt;
    }
  }

  public change_food_qt(row, value) {
    if (value < 0) {
      (document.getElementById('quantity-food-' + row) as HTMLInputElement).value = '' + 0;
    } else {
      (document.getElementById('quantity-food-' + row) as HTMLInputElement).value = '' + value;
    }
  }

  public add_food_row() {
    const row = (this.foodRows[this.foodRows.length - 1]) + 1;
    this.foodRows.push(row);
  }

  public delete_food_row() {
    if (this.foodRows.length > 1) {
      this.foodRows.pop();
    }
  }

  public set_food(row, dish) {
    (document.getElementById('selection-food-' + row) as HTMLSelectElement).value = dish;
    if (dish === 'Piatto') {
      (document.getElementById('price-food-' + row) as HTMLInputElement).value = '' + 0;
    } else {
      for (const d of this.food) {
        if (d.name === dish) {
          (document.getElementById('price-food-' + row) as HTMLInputElement).value = '' + d.price;
        }
      }
    }
  }

  // FUNZIONI NUOVI ORDINI BIBITE
  public increase_drink_qt(row) {
    let qt = parseInt((document.getElementById('quantity-drink-' + row) as HTMLInputElement).value, 10);
    qt++;
    (document.getElementById('quantity-drink-' + row) as HTMLInputElement).value = '' + qt;
  }

  public decrease_drink_qt(row) {
    let qt = parseInt((document.getElementById('quantity-drink-' + row) as HTMLInputElement).value, 10);
    if (qt > 0) {
      qt--;
      (document.getElementById('quantity-drink-' + row) as HTMLInputElement).value = '' + qt;
    }
  }

  public change_drink_qt(row, value) {
    if (value < 0) {
      (document.getElementById('quantity-drink-' + row) as HTMLInputElement).value = '' + 0;
    } else {
      (document.getElementById('quantity-drink-' + row) as HTMLInputElement).value = '' + value;
    }
  }

  public add_drink_row() {
    const row = (this.drinksRows[this.drinksRows.length - 1]) + 1;
    this.drinksRows.push(row);
  }

  public delete_drink_row() {
    if (this.drinksRows.length > 1) {
      this.drinksRows.pop();
    }
  }

  public set_drink(row, drink) {
    (document.getElementById('selection-drink-' + row) as HTMLSelectElement).value = drink;
    if (drink === 'Bibita') {
      (document.getElementById('price-drink-' + row) as HTMLInputElement).value = '' + 0;
    } else {
      for (let i = 0; i < this.food.length; i++) {
        if (this.drinks[i].name === drink) {
          (document.getElementById('price-drink-' + row) as HTMLInputElement).value = '' + this.drinks[i].price;
        }
      }
    }
  }

  public getEstimatedTime(food) {
    for (const dish of this.dishes) {
      if (dish.name === food) {
        return dish.estimated_time;
      }
    }
  }

  public sortOrderFood(order) {
    for (let i = 0; i < order.food.length - 1; i++) {
      for (let j = i + 1; j < order.food.length; j++) {
        if (this.getEstimatedTime(order.food[i]) < this.getEstimatedTime(order.food[j])) {
          const temp = order.food[j];
          order.food[j] = order.food[i];
          order.food[i] = temp;
        }
      }
    }
  }

  public send_order() {
    const foodEl = document.getElementsByName('food');
    const foodQtEl = document.getElementsByName('quantity-food');
    const food = [];

    for (let i = 0; i < foodEl.length; i++) {
      const qt = parseInt((foodQtEl[i] as HTMLInputElement).value, 10);
      if ((foodEl[i] as HTMLSelectElement).value !== 'Piatto') {
        if (qt === 0) {
          window.alert('Specificare le quantità dei piatti!');
          return;
        }
        for (let j = 0; j < qt; j++) {
          food.push((foodEl[i] as HTMLSelectElement).value);
          this.ots.food_ready.push(false);
        }
      } else {
        if (qt > 0) {
          window.alert('Specificare i piatti!');
          return;
        }
      }
    }

    const drinkEl = document.getElementsByName('drink');
    const drinkQtEl = document.getElementsByName('quantity-drink');
    const drink = [];

    for (let i = 0; i < drinkEl.length; i++) {
      const qt = parseInt((drinkQtEl[i] as HTMLInputElement).value, 10);
      if ((drinkEl[i] as HTMLSelectElement).value !== 'Bibita') {
        if (qt === 0) {
          window.alert('Specificare le quantità delle bevande!');
          return;
        }
        for (let j = 0; j < qt; j++) {
          drink.push((drinkEl[i] as HTMLSelectElement).value);
        }
      } else {
        if (qt > 0) {
          window.alert('Specificare le bevande!');
          return;
        }
      }
    }

    if (food.length === 0 && drink.length === 0) {
      window.alert('Inserire dei piatti o delle bevande!');
      return;
    }

    this.ots.food = food;
    this.ots.drinks = drink;
    this.ots.timestamp = new Date();
    this.sortOrderFood(this.ots);

    this.os.post_order(this.ots).subscribe((o) => {
      this.set_empty();
      if (this.table.status) {
        this.ts.put_table(this.table).subscribe((t) => {
          this.table = t;
          this.router.navigate(['/dashboard']);
        }, (error) => {
          console.log('Error occurred while setting table status: ' + error);
        });
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, (error) => {
      console.log('Error occurred while creating order: ' + error);
    });
  }

  public get_single_bill(order) {
    let total = 0;

    for (const dish of order.food) {
      total += this.getDishPrice(dish);
    }
    for (const drink of order.drinks) {
      total += this.getDrinkPrice(drink);
    }
    return total;
  }

  public get_total_bill() {
    let total = 0;
    for (const order of this.orders) {
      total += this.get_single_bill(order);
    }
    return total;
  }

  public pay_all_orders() {
    for (const order of this.orders) {
      this.os.put_order(order).subscribe((o) => {});
    }
    this.ts.put_table(this.table).subscribe((t) => {
      this.router.navigateByUrl('/dashboard');
    });
  }

  public delete_order(id) {
    this.os.delete_order(id).subscribe((o) => {
      this.get_orders();
    });
  }
}
