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
  stakeholder = "assets/images/stakeholder.svg";
  expand_more = "assets/images/expand_more.svg";
  expand_less = "assets/images/expand_less.svg";
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

  // getUser(){
  //   this._authService.getUser()
  //     .subscribe(user => {
  //       this.user = user;
  //     })
  // }
  getUser(){
    this._authService.getUser()
      .subscribe({
        next: (user) => this.user = user,
        error: (e) => {
          console.log("error:", e);
          // if (e.status === 401) {
          //   this._authService.logout();
          // }
        }
      })
  }

}
