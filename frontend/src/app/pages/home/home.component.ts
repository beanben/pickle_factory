import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { User } from '../auth/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user = {} as User;
  isLoggedIn = false;
  check = "";

  constructor(
    public _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
    if(this.isLoggedIn){
      this.getUser();

        // ensure user update from profile is propagated to home
        this._authService.userSubjectSetValue(this.user);
        this._authService.userSubjectGetValue()
          .subscribe(user => {
            if(!!user){
              this.user=user;
            }
            
          })
    }  
  }

  getUser(){
    this._authService.getUser()
      .subscribe(user => {
        this.user = user;
      })
  }

}
