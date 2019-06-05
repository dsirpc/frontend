import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

export let location: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          location = event.url;
        }
    });
  }
}
