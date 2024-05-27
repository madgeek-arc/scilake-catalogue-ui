import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'scilake-catalogue-ui';


  open: boolean = true;

  constructor(private router: Router) {}

  isNotDashboard() {
    return (this.router.url.startsWith('/home')
      || this.router.url.startsWith('/search') || this.router.url.startsWith('/resource')
      || this.router.url.startsWith('/landingPage') || this.router.url.startsWith('/landing'));
  }
}
