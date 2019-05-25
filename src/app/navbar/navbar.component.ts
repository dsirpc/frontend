import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  role: string = 'waiter';

  constructor() { }

  onClickRole() {
    this.role = this.role === 'chef' ? 'common' : 'chef';
  }

  public get getRole(): string {
    return this.role;
  }

  ngOnInit() {
  }

}
