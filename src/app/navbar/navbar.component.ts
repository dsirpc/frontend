import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  role: string;

  constructor(private us: UserService, private router: Router) {}

  ngOnInit() {
    this.role = this.us.get_role();
  }

  public go_to(url) {
    this.router.navigateByUrl(url);
  }

  public logout() {
    this.us.logout();
  }

}
