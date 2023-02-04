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
  isLoggedIn = false;

  user = {} as User;
  subs = Subscription.EMPTY
  loans: Loan[] = [];

  constructor(
    public _authService: AuthService,
    private el: ElementRef,
    private _loanService: LoanService,
    private router: Router
  ) { 
    this.addEventBackgroundClose()
  }

  ngOnInit(): void {
    this.getLoans();

    this.subs = this._authService.requestCompleted$.subscribe(() => {
      this.getUser();
    })
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
  }

  
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onLoanSelected(index: number ){ 
    this._loanService.setLoanSub(this.loans[index]);
    this.router.navigate(["/loans"])
  };

  getLoans(){
    this._loanService.getLoans()
    .subscribe(loans => {
      this.loans = loans;

    })
  }

}
