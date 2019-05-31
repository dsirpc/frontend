import { Component, OnInit, ElementRef, ViewChild, NgModule, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../table.service';
import { Table } from '../Table';
import { Order } from '../Order';
import { UserService } from '../user.service';
import { OrderService } from '../order.service';
import { Dish } from '../Dish';
import { DishService } from '../dish.service';
import { FormsModule } from '@angular/forms';

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
  private dishes: Dish[] = [];
  private dishesRows = [0];
  private drinks: Dish[] = [];
  private drinksRows = [0];
  private ots: Order;

  constructor(private route: ActivatedRoute,
              private ts: TableService,
              private router: Router,
              private us: UserService,
              private os: OrderService,
              private ds: DishService) {}

  ngOnInit() {
    this.tableNumber = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.get_table(this.tableNumber);
    this.get_orders(this.tableNumber);
    this.get_food();
    this.get_drinks();
    this.set_empty();
    console.log(this.orders);
  }

  set_empty() {
    this.ots = {_id: '0',
                table_number: this.tableNumber,
                dishes: [], drinks: [],
                dishes_ready: 0,
                chef: '',
                waiter: '',
                barman: '',
                status: 0,
                timestamp: new Date()};
  }

  public get_table(tableNumber: number) {
    this.ts.get_table(tableNumber).subscribe(
      (t) => {
        this.table = t;
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_table(tableNumber);
        },
        (err2) => {
          this.us.logout();
          this.router.navigate(['/']);
        });
      }
    );
  }

  public get_orders(tableNumber: number) {
    this.os.get_order(tableNumber).subscribe(
      (o) => {
        this.orders = o;
        console.log(this.orders);
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_orders(tableNumber);
        },
        (err2) => {
          this.us.logout();
          this.router.navigate(['/']);
        });
      }
    );
  }

  public get_food() {
    this.ds.get_food().subscribe(
      (d) => {
        this.dishes.push(...d);
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_food();
        },
        (err2) => {
          this.us.logout();
          this.router.navigate(['/']);
        });
      }
    );
  }

  public get_drinks() {
    this.ds.get_drinks().subscribe(
      (d) => {
        this.drinks.push(...d);
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_drinks();
        },
        (err2) => {
          this.us.logout();
          this.router.navigate(['/']);
        });
      }
    );
  }

  // FUNZIONI DISPLAY ORDINI ESISTENTI
  public getDishPrice(dish) {
    for (const d of this.dishes) {
      if (d.name === dish) {
        return d.price;
      }
    }
  }

  public getDishQuantity(order, dish) {
    for (const o of this.orders) {
      if (o._id == order) {
        let qt = 0;
        for (const d of o.dishes) {
          if (d === dish) {
            qt++;
          }
        }
        return qt;
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
    for (const o of this.orders) {
      if (o._id == order) {
        let qt = 0;
        for (const d of o.drinks) {
          if (d === drink) {
            qt++;
          }
        }
        return qt;
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
    const row = (this.dishesRows[this.dishesRows.length - 1]) + 1;
    this.dishesRows.push(row);
  }

  public delete_food_row() {
    if (this.dishesRows.length > 1) {
      this.dishesRows.pop();
    }
  }

  public set_food(row, dish) {
    (document.getElementById('selection-food-' + row) as HTMLSelectElement).value = dish;
    if (dish === 'Piatto') {
      (document.getElementById('price-food-' + row) as HTMLSpanElement).textContent = '' + 0;
    } else {
      for (const d of this.dishes) {
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
      for (let i = 0; i < this.dishes.length; i++) {
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

    this.ots.dishes = food;
    this.ots.drinks = drink;
    this.ots.timestamp = new Date();

    this.os.post_order(this.ots).subscribe((o) => {
      this.set_empty();
    }, (error) => {
      console.log('Error occurred while creating order: ' + error);
    });

    if (this.table.status) {
      this.ts.put_table(this.table).subscribe((t) => {
        this.router.navigate(['/dashboard']);
      }, (error) => {
        console.log('Error occurred while setting table status: ' + error);
      });
    }
  }
}
