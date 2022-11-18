import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  logo = "/assets/images/logo.svg";
  isLogin = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.router.url.includes('login')){
      this.isLogin = true;
    }
  }

}
