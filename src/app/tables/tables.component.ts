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

  private tableNumber: number; // id table (get from url)
  private table: Table;
  private orders: Order[] = [];
  private food: Dish[] = [];
  private drinks: Dish[] = [];
  private uniqueDishOrders = [];
  private foodRows = [0];
  private drinksRows = [0];
  private ots: Order;
  private role: string;

  constructor(private route: ActivatedRoute,
              private ts: TableService,
              private router: Router,
              private us: UserService,
              private os: OrderService,
              private ds: DishService,
              private sio: SocketioService) {}

  ngOnInit() {
    this.tableNumber = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.get_table();
    this.get_orders();
    this.get_dishes();
    this.get_drinks();
    this.set_empty();
    this.role = this.us.get_role();
    if (this.role === 'CASHER') {
      this.sio.onOrderSent().subscribe((o) => {
        this.get_orders();
        this.router.navigateByUrl('tables/' + this.tableNumber);
      });
      this.sio.onOrderStarted().subscribe((o) => {
        this.get_orders();
        this.router.navigateByUrl('tables/' + this.tableNumber);
      });
      this.sio.onDishCompleted().subscribe((o) => {
        this.get_orders();
        this.router.navigateByUrl('tables/' + this.tableNumber);
      });
      this.sio.onOrderCompleted().subscribe((o) => {
        this.get_orders();
        this.router.navigateByUrl('tables/' + this.tableNumber);
      });
    }
  }

  set_empty() {
    this.ots = {_id: '0',
                table_number: this.tableNumber,
                food: [],
                drinks: [],
                food_ready: 0,
                chef: '',
                waiter: '',
                barman: '',
                status: 0,
                payed: false,
                timestamp: new Date()};
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
        for (const o of orders) {
          if (o.table_number === this.tableNumber && !o.payed) {
            this.orders.push(o);
          }
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
      (food) => {
        for (const d of food) {
          if (d.type === 'food') {
            this.food.push(d);
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

  public get_drinks() {
    this.ds.get_dishes().subscribe(
      (drinks) => {
        for (const d of drinks) {
          if (d.type === 'drink') {
            this.drinks.push(d);
          }
        }
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_drinks();
        },
        (err2) => {
          this.us.logout();
        });
      }
    );
  }

  public delete_dish_duplicate() {
    for (const o of this.orders) {
      console.log(o);
      const order = {id: o._id, food: [], food_qt: [], drinks: [], drink_qt: [], status: o.status, n_food_completed: o.food_ready, n_total_food: 0};
      for (const d of o.food) {
        order.n_total_food += 1;
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
      (document.getElementById('price-food-' + row) as HTMLSpanElement).textContent = '' + 0;
    } else {
      for (const d of this.food) {
        if (d.name === dish) {
          (document.getElementById('price-food-' + row) as HTMLSpanElement).textContent = '' + d.price;
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
      (document.getElementById('price-drink-' + row) as HTMLSpanElement).textContent = '' + 0;
    } else {
      for (let i = 0; i < this.food.length; i++) {
        if (this.drinks[i].name === drink) {
          (document.getElementById('price-drink-' + row) as HTMLSpanElement).textContent = '' + this.drinks[i].price;
        }
      }
    }
  }

  public send_order() {
    const foodEl = document.getElementsByName('food');
    const foodQtEl = document.getElementsByName('quantity-food');
    const food = [];

    for (let i = 0; i < foodEl.length; i++) {
      if ((foodEl[i] as HTMLSelectElement).value !== 'Piatto') {
        const qt = parseInt((foodQtEl[i] as HTMLInputElement).value, 10);
        for (let j = 0; j < qt ; j++) {
          food.push((foodEl[i] as HTMLSelectElement).value);
        }
      }
    }

    if (foodEl.length === 0 || foodQtEl.length === 0 || foodEl.length !== foodQtEl.length) {
      window.alert('Mancano le quantità o i piatti');
      return;
    }

    const drinkEl = document.getElementsByName('drink');
    const drinkQtEl = document.getElementsByName('quantity-drink');
    const drink = [];

    for (let i = 0; i < drinkEl.length; i++) {
      if ((drinkEl[i] as HTMLSelectElement).value !== 'Bibita') {
        const qt = parseInt((drinkQtEl[i] as HTMLInputElement).value, 10);
        for (let j = 0; j < qt ; j++) {
          drink.push((drinkEl[i] as HTMLSelectElement).value);
        }
      }
    }

    if (drinkEl.length !== drinkQtEl.length) {
      window.alert('Specificare quantità o nomi bibite');
      return;
    }

    this.ots.food = food;
    this.ots.drinks = drink;
    this.ots.timestamp = new Date();

    this.os.post_order(this.ots).subscribe((o) => {
      this.set_empty();
    }, (error) => {
      console.log('Error occurred while creating order: ' + error);
    });

    if (this.table.status) {
      this.ts.put_table(this.table).subscribe((t) => {}, (error) => {
        console.log('Error occurred while setting table status: ' + error);
      });
    }
    this.router.navigate(['/dashboard']);
  }

  public get_bill(order) {
    let total = 0;

    for (const o of this.orders) {
      if (o._id == order) {
        for (const dish of o.food) {
          total += this.getDishPrice(dish);
        }
        for (const drink of o.drinks) {
          total += this.getDrinkPrice(drink);
        }
        return total;
      }
    }
  }

  public pay(order) {
    let allPayed = true;
    for (const o of this.orders) {
      if (o._id == order.id) {
        this.os.put_order(o).subscribe((or) => {});
      } else {
        if (!o.payed) {
          allPayed = false;
        }
      }
    }
    if (allPayed) {
      this.ts.put_table(this.table).subscribe((t) => {});
    }
    this.router.navigateByUrl('/dashboard');
  }
}
