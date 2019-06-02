import { Component, OnInit } from '@angular/core';
import { TableService } from '../services/table.service';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  private pageTitle: string = "Statistiche";
  private numberTables = 0;
  private numberOccupiedTables = 0;
  private ordersSent = 0;
  private ordersInProgess = 0;
  constructor(private ts: TableService, private os: OrderService, private us: UserService, private sio: SocketioService) { }

  ngOnInit() {
    this.get_number_tables();
    this.get_occupied_tables();
    this.get_orders();
    this.sio.connect();
    this.sio.onTableFree().subscribe((t) => {
      this.numberOccupiedTables--;
    });
    this.sio.onTableOccupied().subscribe((t) => {
      this.numberOccupiedTables++;
    });
    this.sio.onOrderSent().subscribe((o) => {
      this.ordersSent++;
    });
    this.sio.onOrderStarted().subscribe((o) => {
      this.ordersSent--;
      this.ordersInProgess++;
    });
    this.sio.onOrderCompleted().subscribe((o) => {
      this.ordersInProgess--;
    });
  }

  public get_occupied_tables() {
    this.ts.get_tables().subscribe((tables) => {
      for (const table of tables) {
        if (!table.status) {
          this.numberOccupiedTables++;
        }
      }
    });
  }

  public get_number_tables() {
    this.ts.get_tables().subscribe((tables) => {
      this.numberTables = tables.length;
    });
  }

  public get_orders() {
    this.os.get_orders().subscribe((orders) => {
      for (const order of orders) {
        if (order.status === 0) {
          this.ordersSent++;
        } else {
          if (order.status === 1) {
            this.ordersInProgess++;
          }
        }
      }
    });
  }

}
