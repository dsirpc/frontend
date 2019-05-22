import { Component, OnInit, Input } from '@angular/core';
import { Table } from '../Table';
import { TableService } from '../table.service';
import { SocketioService } from '../socketio.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-tables',
  templateUrl: './dashboard-tables.component.html',
  styleUrls: ['./dashboard-tables.component.css']
})
export class DashboardTablesComponent implements OnInit {
  @Input()
  private tables: Table[];

  constructor(private ts: TableService, private sio: SocketioService, private us: UserService, private router: Router) {
    console.log('DashboardTablesComponent');
  }

  ngOnInit() {
    this.get_tables();
    this.sio.connect().subscribe( (t) => {
      this.get_tables();
    });
  }

  public get_tables() {
    this.ts.get_tables().subscribe(
      (tables) => {
        this.tables = tables;
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_tables();
        },
        (err2) => {
          this.logout();
        });
      }
    );
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

}
