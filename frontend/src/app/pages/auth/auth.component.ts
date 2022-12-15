import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  logo = "/assets/images/logo.svg";
  isLogin = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // to ensure forgot page has login button
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
         const currentUrl = event.url;
         if (currentUrl.includes('forgot')){
            this.isLogin = false;
          };
      }
    })
  }



}
