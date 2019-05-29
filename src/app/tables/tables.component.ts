import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../table.service';
import { Table } from '../Table';
import { Order } from '../Order';
import { UserService } from '../user.service';
import { OrderService } from '../order.service';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

  private tableNumber: number; // id table (get from url)
  private table: Table;
  private orders: Order[] = [];

  constructor(private route: ActivatedRoute,
              private ts: TableService,
              private router: Router,
              private us: UserService,
              private os: OrderService) {}

  ngOnInit() {
    this.tableNumber = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    // this.set_empty();
    this.get_table(this.tableNumber);
    this.get_orders(this.tableNumber);
    console.log(this.tableNumber);
  }

  public set_empty() {
    this.table = {number_id: 0, seats: 0, status: true};
  }

  public get_table(tableNumber: number) {
    this.ts.get_table(tableNumber).subscribe(
      (t) => {
        this.table = t;
        console.log(this.table);
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
}
