import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  role: string = 'waiter';

  constructor(private us: UserService, private router: Router) { }

  onClickRole() {
    this.role = this.role === 'chef' ? 'common' : 'chef';
  }

  public get getRole(): string {
    return this.role;
  }

  ngOnInit() {
  }

  public go_to(url) {
    this.router.navigateByUrl(url);
  }

  public logout() {
    this.us.logout();
  }

}
