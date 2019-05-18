import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-tables',
  templateUrl: './dashboard-tables.component.html',
  styleUrls: ['./dashboard-tables.component.css']
})
export class DashboardTablesComponent implements OnInit {
  @Input()
  private testTables;

  constructor() {
    console.log('DashboardTablesComponent');
  }

  ngOnInit() {
    console.log(this.testTables);
  }

}
