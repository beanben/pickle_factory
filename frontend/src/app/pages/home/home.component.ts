import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { User } from '../auth/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  openPopup = false;
  user = {} as User;
  isLoggedIn = false;

  constructor(
    public _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    if(this.isLoggedIn){
      this.getUser();
    }  
  }

  getUser(){
    this._authService.getUser()
      .subscribe(user => {
        this.user = user;

        this._authService.changeUserSub(user);

        this._authService.currentUser
          .subscribe(user => this.user=user)
      })
  };

  closePopup(){
    this.openPopup = false;
  }

}
