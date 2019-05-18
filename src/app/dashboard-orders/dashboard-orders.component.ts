import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-orders',
  templateUrl: './dashboard-orders.component.html',
  styleUrls: ['./dashboard-orders.component.css']
})
export class DashboardOrdersComponent implements OnInit {

  @Input()
  private testOrders;

  constructor() { }

  ngOnInit() {
    console.log(this.testOrders);
  }

}
