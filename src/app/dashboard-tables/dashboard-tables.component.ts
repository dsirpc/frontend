import { Component, OnInit, Input } from '@angular/core';
import { Table } from '../Table';
import { TableService } from '../services/table.service';
import { SocketioService } from '../services/socketio.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-tables',
  templateUrl: './dashboard-tables.component.html',
  styleUrls: ['./dashboard-tables.component.css']
})
export class DashboardTablesComponent implements OnInit {
  @Input() role: string;

  tables: Table[];

  constructor(private ts: TableService, private sio: SocketioService, private us: UserService, private router: Router) {}

  ngOnInit() {
    this.get_tables();
    this.sio.connect();
    this.sio.onTableFree().subscribe((t) => {
      this.get_tables();
    });
    this.sio.onTableOccupied().subscribe((t) => {
      this.get_tables();
    });
  }

  public get_tables() {
    this.ts.get_tables().subscribe(
      (tables) => {
        this.tables = tables;
        this.sort_tables();
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_tables();
        },
          (err2) => {
            this.us.logout();
          });
      }
    );
  }

  public loadTablePage(numberId: string) {
    this.router.navigateByUrl('tables/' + numberId);
  }

  public sort_tables() {
    for (let i = 0; i < this.tables.length - 1; i++) {
      for (let j = i + 1; j < this.tables.length; j++) {
        if (this.tables[i].number_id > this.tables[j].number_id) {
          const tmp = this.tables[i];
          this.tables[i] = this.tables[j];
          this.tables[j] = tmp;
        }
      }
    }
  }

}
