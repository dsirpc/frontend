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
  @ViewChild('quantity') qt: ElementRef;
  @ViewChild('ul') ul: ElementRef;

  private tableNumber: number; // id table (get from url)
  private table: Table;
  private orders: Order[] = [];
  private dishes: Dish[] = [];
  private selectedOption: string;

  constructor(private route: ActivatedRoute,
              private ts: TableService,
              private router: Router,
              private us: UserService,
              private os: OrderService,
              private ds: DishService,
              private er: ElementRef,
              private viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.tableNumber = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.get_table(this.tableNumber);
    this.get_orders(this.tableNumber);
    this.get_dishes();
    this.selectedOption = 'Piatto';
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

  public get_dishes() {
    this.ds.get_dishes().subscribe(
      (d) => {
        this.dishes.push(...d);
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_dishes();
        },
        (err2) => {
          this.us.logout();
          this.router.navigate(['/']);
        });
      }
    );
  }

  public getPrice(value) {
    for (let i = 0; i < this.dishes.length; i++) {
      if (this.dishes[i].name === value) {
        return this.dishes[i].price;
      }
    }
  }

  public getQuantity(order, dish) {
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i]._id == order) {
        let index = this.orders[i].dishes.indexOf(dish);
        return this.orders[i].dishes_qt[index];
      }
    }
  }

  public increase() {
    let qt = parseInt(this.qt.nativeElement.value, 10);
    qt++;
    this.qt.nativeElement.value = qt;
  }

  public decrease() {
    let qt = parseInt(this.qt.nativeElement.value, 10);
    if (qt > 0) {
      qt--;
      this.qt.nativeElement.value = qt;
    }
  }

  public add_row() {
    let s = '<li class="list-group-item d-flex justify-content-between align-items-center"><select [(ngModel)]="selectedOption"><option selected>Piatto</option><option *ngFor="let dish of dishes">dish.name</option></select><span>{{getPrice(selectedOption)}}</span><span><input type="text" #quantity value="0">&nbsp;<button name="qt" class="btn btn-outline-secondary" type="button" id="increase" (click)="increase()">+</button>&nbsp;<button name="qt" class="btn btn-outline-secondary" type="button" id="decrease" (click)="decrease()">-</button></span></li>';
    // document.getElementById("ul").innerHTML += s;
    let element = document.getElementById('ul').cloneNode(true);
    console.log(element);
    document.getElementById('ul').appendChild(element);
  }
}
