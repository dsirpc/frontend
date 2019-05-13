import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private pageTitle = "Dashboard";
  private role: string;

  constructor() {
    //this.role = NavbarComponent.getRole();
  }

  ngOnInit() {
  }

}
