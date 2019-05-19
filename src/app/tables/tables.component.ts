import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  private tableId: string; //id table (get from url)

  private testOrder: {
    "table": 1,
    "plates": [1, 3, 5],
    "howmany": [1, 1, 1]
  };

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.tableId = this.route.snapshot.paramMap.get('id');
  }

}
