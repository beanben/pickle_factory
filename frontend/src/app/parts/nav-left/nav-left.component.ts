import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/pages/auth/user';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.css']
})
export class NavLeftComponent implements OnInit {
  logo = "assets/images/logo.svg";
  home = "assets/images/home.svg";
  lender = "assets/images/lender.svg";
  person = "assets/images/person.svg";
  arrow_down = "assets/images/arrow_down.svg";
  arrow_up = "assets/images/arrow_up.svg";
  dollar = "assets/images/dollar.svg";
  chart = "assets/images/chart.svg";
  house = "assets/images/house.svg";
  is_expanded = false;
  user = {} as User;
  // openPopup = true;
  openPopup = false;
  button_clicked = false;

  constructor(
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getUser();
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

  getUser(){
    this._authService.getUser()
      .subscribe(user => this.user = user)
      // .subscribe({
      //   next: (user) => this.user = user,
      //   error: (e) => {
      //     console.log("error:", e);
      //   }
      // })
  }

}
