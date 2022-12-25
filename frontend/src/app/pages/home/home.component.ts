import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { User } from '../auth/user';
import { Loan } from '../loan/loan';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  openLoanModal = false;
  user = {} as User;
  isLoggedIn = false;

  constructor(
    public _authService: AuthService,
    private el: ElementRef,
    private router: Router
  ) { 
    this.addEventBackgroundClose()
  }

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
    this.openLoanModal = false;
  }

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.closePopup();
      }
    });
  };

  onSave(loan:Loan | null){
    this.openLoanModal = false;

    if(!!loan){
      this.router.navigate(['/loan'])
    }
  }

}
