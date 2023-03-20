import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  logo = "assets/images/logoDark.svg";
  isLogin = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!this.router.url.includes('login')){
      this.isLogin = false
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
         let currentUrl = event.url;
         if (currentUrl.includes('forgot') || currentUrl.includes('register')) {
            this.isLogin = false;
        } else {
            this.isLogin = true;
        }
      };

    })
  }



}
