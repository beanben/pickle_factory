import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this._authService.getUser()
      .subscribe(user => {
        this._authService.setUserSub(user);
      })
  }

}
