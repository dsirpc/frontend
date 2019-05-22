import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../table.service';
import { Table } from '../Table';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  private tableId: string; // id table (get from url)
  private table: Table;

  private testOrder: {
    "table": 1,
    "plates": [1, 3, 5],
    "howmany": [1, 1, 1]
  };

  constructor(private route: ActivatedRoute, private ts: TableService, private router: Router, private us: UserService) {
  }

  ngOnInit() {
    this.tableId = this.route.snapshot.paramMap.get('id');
    this.get_table(this.tableId);
  }

  public get_table(tableId) {
    this.ts.get_table(tableId).subscribe(
      (t) => {
        this.table = t;
      },
      (err) => {
        this.us.renew().subscribe(() => {
          this.get_table(tableId);
        },
        (err2) => {
          this.us.logout();
          this.router.navigate(['/']);
        });
      }
    );
  }

}
