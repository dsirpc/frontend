import { Component, OnInit } from '@angular/core';
import { TableService } from '../services/table.service';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { SocketioService } from '../services/socketio.service';
import { Router } from '@angular/router';
import { User } from '../User';
import { Order } from '../Order';
import { Dish } from '../Dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  pageTitle = 'Statistiche';
  numberTables = 0;
  numberOccupiedTables = 0;
  ordersSent = 0;
  ordersInProgess = 0;
  ordersCompleted = 0;
  orders: Order[] = [];
  dishes: Dish[] = [];
  ordersChefs = [];
  ordersWaiters = [];
  ordersBarmans = [];
  dishesChefs = [];
  dishesWaiters = [];
  dishesBarmans = [];
  criterioChef: number = 0;
  criterioWaiter: number = 0;
  criterioBarman: number = 0;
  criterioRole: number = 0;

  constructor(private ts: TableService, private os: OrderService, private us: UserService, private sio: SocketioService, private router: Router, private ds: DishService) {
    if (this.us.get_token() === '') {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.get_number_tables();
    this.get_occupied_tables();
    this.get_orders();
    this.get_dishes();
    this.sio.connect();
    this.sio.onTableFree().subscribe((t) => {
      this.numberOccupiedTables--;
    });
    this.sio.onTableOccupied().subscribe((t) => {
      this.numberOccupiedTables++;
    });
    this.sio.onOrderSent().subscribe((o) => {
      this.get_orders();
    });
    this.sio.onOrderFoodStarted().subscribe((o) => {
      this.get_orders();
      this.ordersSent--;
    });
    this.sio.onOrderFoodCompleted().subscribe((o) => {
      this.get_orders();
      this.ordersInProgess--;
    });
    this.sio.onOrderDrinkStarted().subscribe((o) => {
      this.get_orders();
    });
    this.sio.onOrderDrinkCompleted().subscribe((o) => {
      this.get_orders();
    });
    this.criterioChef = 0;
    this.criterioWaiter = 0;
    this.criterioBarman = 0;
    this.criterioRole = 0;
  }

  public get_occupied_tables() {
    this.ts.get_tables().subscribe((tables) => {
      for (const table of tables) {
        if (!table.status) {
          this.numberOccupiedTables++;
        }
      }
    },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_occupied_tables();
        },
          (err2) => {
            this.us.logout();
          });
      });
  }

  public get_number_tables() {
    this.ts.get_tables().subscribe((tables) => {
      this.numberTables = tables.length;
    },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_number_tables();
        },
          (err2) => {
            this.us.logout();
          });
      });
  }

  public get_orders() {
    this.os.get_orders().subscribe((orders) => {
      for (const order of orders) {
        if (order.food_status === 0) {
          this.ordersSent++;
        } else {
          if (order.food_status === 1) {
            this.ordersInProgess++;
          } else {
            if (order.food_status === 2) {
              this.ordersCompleted++;
            }
          }
        }
      }
      this.orders = orders;
      this.get_users();
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
    this.ds.get_dishes().subscribe((dishes) => {
      this.dishes = dishes;
    },
    (err) => {
      this.us.renew().subscribe(() => {
        this.get_dishes();
      },
        (err2) => {
          this.us.logout();
        });
    });
  }

  public get_users() {
    this.ordersChefs = [];
    this.dishesChefs = [];
    this.ordersWaiters = [];
    this.dishesWaiters = [];
    this.ordersBarmans = [];
    this.dishesBarmans = [];
    this.us.get_users().subscribe((users) => {
      for (const user of users) {
        switch (user.role) {
          case 'CHEF':
            this.ordersChefs.push({ username: user.username, orders: 0, role: user.role });
            this.dishesChefs.push({ username: user.username, dishes: 0, role: user.role });
            break;
          case 'WAITER':
            this.ordersWaiters.push({ username: user.username, orders: 0, role: user.role });
            this.dishesWaiters.push({ username: user.username, dishes: 0, role: user.role });
            break;
          case 'BARMAN':
            this.ordersBarmans.push({ username: user.username, orders: 0, role: user.role });
            this.dishesBarmans.push({ username: user.username, dishes: 0, role: user.role });
            break;
        }
      }
      this.get_stats(users);
    },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_users();
        },
          (err2) => {
            this.us.logout();
          });
      });
  }

  public get_stats(users) {
    for (const order of this.orders) {
      let i = 0;
      let found = false;

      while (i < this.ordersChefs.length && !found) {
        if (this.ordersChefs[i].username === order.chef) {
          this.ordersChefs[i].orders += 1;
          this.dishesChefs[i].dishes += order.food.length;
          found = true;
        }
        i++;
      }

      i = 0;
      found = false;
      while (i < this.ordersWaiters.length && !found) {
        if (this.ordersWaiters[i].username === order.waiter) {
          this.ordersWaiters[i].orders += 1;
          this.dishesWaiters[i].dishes += order.food.length + order.drinks.length;
          found = true;
        }
        i++;
      }

      i = 0;
      found = false;
      while (i < this.ordersBarmans.length && !found) {
        if (this.ordersBarmans[i].username === order.barman) {
          this.ordersBarmans[i].orders += 1;
          this.dishesBarmans[i].dishes += order.drinks.length;
          found = true;
        }
        i++;
      }
    }

    const chefsOrders = [];
    const waitersOrders = [];
    const barmansOrders = [];
    const chefsDishes = [];
    const waitersDishes = [];
    const barmansDishes = [];

    for (let i = 0; i < this.ordersChefs.length; i++) {
      chefsOrders.push(this.ordersChefs[i].orders);
      chefsDishes.push(this.dishesChefs[i].dishes);
    }
    for (let i = 0; i < this.ordersWaiters.length; i++) {
      waitersOrders.push(this.ordersWaiters[i].orders);
      waitersDishes.push(this.dishesWaiters[i].dishes);
    }
    for (let i = 0; i < this.ordersBarmans.length; i++) {
      barmansOrders.push(this.ordersBarmans[i].orders);
      barmansDishes.push(this.dishesBarmans[i].dishes);
    }

    for (let i = 0; i < chefsOrders.length - 1; i++) {
      for (let j = i + 1; j < chefsOrders.length; j++) {
        if (chefsOrders[i] < chefsOrders[j]) {
          const temp = chefsOrders[i];
          chefsOrders[i] = chefsOrders[j];
          chefsOrders[j] = temp;
          const tmp = this.ordersChefs[i];
          this.ordersChefs[i] = this.ordersChefs[j];
          this.ordersChefs[j] = tmp;
        }
        if (chefsDishes[i] < chefsDishes[j]) {
          const temp = chefsDishes[i];
          chefsDishes[i] = chefsDishes[j];
          chefsDishes[j] = temp;
          const tmp = this.dishesChefs[i];
          this.dishesChefs[i] = this.dishesChefs[j];
          this.dishesChefs[j] = tmp;
        }
      }
    }

    for (let i = 0; i < waitersOrders.length - 1; i++) {
      for (let j = i + 1; j < waitersOrders.length; j++) {
        if (waitersOrders[i] < waitersOrders[j]) {
          const temp = waitersOrders[i];
          waitersOrders[i] = waitersOrders[j];
          waitersOrders[j] = temp;
          const tmp = this.ordersWaiters[i];
          this.ordersWaiters[i] = this.ordersWaiters[j];
          this.ordersWaiters[j] = tmp;
        }
        if (waitersDishes[i] < waitersDishes[j]) {
          const temp = waitersDishes[i];
          waitersDishes[i] = waitersDishes[j];
          waitersDishes[j] = temp;
          const tmp = this.dishesWaiters[i];
          this.dishesWaiters[i] = this.dishesWaiters[j];
          this.dishesWaiters[j] = tmp;
        }
      }
    }

    for (let i = 0; i < barmansOrders.length - 1; i++) {
      for (let j = i + 1; j < barmansOrders.length; j++) {
        if (barmansOrders[i] < barmansOrders[j]) {
          const temp = barmansOrders[i];
          barmansOrders[i] = barmansOrders[j];
          barmansOrders[j] = temp;
          const tmp = this.ordersBarmans[i];
          this.ordersBarmans[i] = this.ordersBarmans[j];
          this.ordersBarmans[j] = tmp;
        }
        if (barmansDishes[i] < barmansDishes[j]) {
          const temp = barmansDishes[i];
          barmansDishes[i] = barmansDishes[j];
          barmansDishes[j] = temp;
          const tmp = this.dishesBarmans[i];
          this.dishesBarmans[i] = this.dishesBarmans[j];
          this.dishesBarmans[j] = tmp;
        }
      }
    }
  }

  public change_criterio_chef() {
    this.criterioChef = parseInt((document.getElementById('CriterioChef') as HTMLSelectElement).value, 10);
  }

  public change_criterio_waiter() {
    this.criterioWaiter = parseInt((document.getElementById('CriterioWaiter') as HTMLSelectElement).value, 10);
  }

  public change_criterio_barman() {
    this.criterioBarman = parseInt((document.getElementById('CriterioBarman') as HTMLSelectElement).value, 10);
  }

  public change_criterio_role() {
    this.criterioRole = parseInt((document.getElementById('CriterioRole') as HTMLSelectElement).value, 10);
  }

  public getDishPrice(food) {
    for (const d of this.dishes) {
      if (d.name === food) {
        return d.price;
      }
    }
  }

  public get_order_bill(order) {
    let total = 0;
    for (const dish of order.food) {
      total += this.getDishPrice(dish);
    }
    return total;
  }

  public get_daily_collection() {
    let total = 0;
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const time = date.getTime();
    for (const order of this.orders) {
      const d = new Date(order.timestamp);
      if (order.payed && d.getTime() >= time) {
        total += this.get_order_bill(order);
      }
    }
    return total;
  }

}
