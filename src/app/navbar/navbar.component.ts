import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  role: string = 'waiter';

  constructor(private us: UserService) { }

  onClickRole() {
    this.role = this.role === 'chef' ? 'common' : 'chef';
  }

  public get getRole(): string {
    return this.role;
  }

  ngOnInit() {
  }

  public logout() {
    this.us.logout();
  }

}
