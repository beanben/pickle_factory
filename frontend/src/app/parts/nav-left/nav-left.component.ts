import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/pages/auth/user';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.css']
})
export class NavLeftComponent implements OnInit, OnDestroy {
  logoWhite = "assets/images/logoWhite.svg";
  home = "assets/images/home.svg";
  lender = "assets/images/lender.svg";
  person = "assets/images/person.svg";
  arrowDown = "assets/images/arrowDown.svg";
  arrowUp = "assets/images/arrowUp.svg";
  dollar = "assets/images/dollar.svg";
  chart = "assets/images/chart.svg";
  house = "assets/images/house.svg";
  isExpanded = false;
  openPopup = false;
  fundersIsActive = false;

  sub = Subscription.EMPTY;
  user = {} as User;
  
  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.identifyUrl();
  }

  onOpenPopup(){
    this.openPopup = true;
  }
  closePopup(){
    this.openPopup = false;
  }

  logout(){
    this._authService.logout();
  }

   getUser() {
  this.sub = this._authService.getUser()
    .subscribe(user => {
      this.user = user;
      this._authService.setUserSub(user);
    })
  }

  identifyUrl(){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
         let currentUrl = event.url;

         if (currentUrl.includes('borrower')){
          this.isExpanded = true
         } else {
          this.isExpanded = false
         }
      };

    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
