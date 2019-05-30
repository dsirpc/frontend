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
                dishes_qt: [],
                drinks_qt: [],
                dishes_ready: 0,
                chef: '',
                waiter: '',
                barman: '',
                status: 0};
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
    for (let i = 0; i < this.dishes.length; i++) {
      if (this.dishes[i].name === dish) {
        return this.dishes[i].price;
      }
    }
  }

  public getDishQuantity(order, dish) {
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i]._id == order) {
        const index = this.orders[i].dishes.indexOf(dish);
        return this.orders[i].dishes_qt[index];
      }
    }
  }

  public getDrinkPrice(drink) {
    for (let i = 0; i < this.drinks.length; i++) {
      if (this.drinks[i].name === drink) {
        return this.drinks[i].price;
      }
    }
  }

  public getDrinkQuantity(order, drink) {
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i]._id == order) {
        const index = this.orders[i].drinks.indexOf(drink);
        return this.orders[i].drinks_qt[index];
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
      for (let i = 0; i < this.dishes.length; i++) {
        if (this.dishes[i].name === dish) {
          (document.getElementById('price-food-' + row) as HTMLSpanElement).textContent = '' + this.dishes[i].price;
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
    const foodQt = [];
    foodEl.forEach(d => {
      if ((d as HTMLSelectElement).value !== 'Piatto') {
        food.push((d as HTMLSelectElement).value);
      }
    });
    foodQtEl.forEach(q => {
      const qt = parseInt((q as HTMLInputElement).value, 10);
      if (qt > 0) {
        foodQt.push(qt);
      }
    });

    if (food.length === 0 || foodQt.length === 0 || food.length !== foodQt.length) {
      console.log(food.length);
      console.log(foodQt.length);
      window.alert('Mancano le quantità o i piatti');
      return;
    }

    const drinkEl = document.getElementsByName('drink');
    const drinkQtEl = document.getElementsByName('quantity-drink');
    const drink = [];
    const drinkQt = [];

    drinkEl.forEach(d => {
      if ((d as HTMLSelectElement).value !== 'Bibita') {
        drink.push((d as HTMLSelectElement).value);
      }
    });
    drinkQtEl.forEach(q => {
      const qt = parseInt((q as HTMLInputElement).value, 10);
      if (qt > 0) {
        drinkQt.push(qt);
      }
    });

    if (drink.length !== drinkQt.length) {
      window.alert('Specificare quantità o nomi bibite');
      return;
    }

    this.ots.dishes = food;
    this.ots.dishes_qt = foodQt;
    this.ots.drinks = drink;
    this.ots.drinks_qt = drinkQt;

    this.os.post_order(this.ots).subscribe((o) => {
      this.set_empty();
      this.ts.put_table(this.table).subscribe((t) => {
        this.router.navigate(['/dashboard']);
      });
    });
  }
}
