import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { User } from '../auth/user';
import { Loan } from '../loans/loan/loan';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  openLoanModal = false;
  user = {} as User;
  isLoggedIn = false;
  subs = Subscription.EMPTY

  constructor(
    private _loanService: LoanService,
    public _authService: AuthService,
    private el: ElementRef,
    private router: Router
  ) { 
    this.addEventBackgroundClose()
  }

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();

    if(this.isLoggedIn){
     this.subs = this._authService.requestCompleted$.subscribe(() => {
        this.getUser();
      })
      
    }  
  }

  getUser(){
    let userSubValue:User = this._authService.userSub.getValue();

    if(userSubValue){
      this.user = userSubValue;
    
    } else {
      this._authService.getUser()
        .subscribe(user => {
          this.user = user;
          this._authService.setUserSub(user);
        })
    }
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

    // if(!!loan){
    //   this._loanService.setLoanSub(loan);
    //   this.router.navigate(['/loan']);
    // }
  }

  getUserSub(){
    this._authService.getUserSub()
      .subscribe(user => this.user)
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
