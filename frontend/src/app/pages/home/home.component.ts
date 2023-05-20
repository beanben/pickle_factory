import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_interfaces/auth.interface';
import { Loan } from 'src/app/_interfaces/loan.interface';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { LoanService } from 'src/app/_services/loan/loan.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  user = {} as User;
  subs: Subscription[] = []
  loans: Loan[] = [];
  dollar = "assets/images/dollar.svg";

  constructor(
    public _authService: AuthService,
    private _loanService: LoanService,
    private router: Router
  ) { 
  }

  ngOnInit(): void {
    if(this._authService.isLoggedIn()){
      this.getLoans();
      this.getUser();
    }
  }

  getUser(){
    this.subs.push(
      this._authService.getUserSub()
        .subscribe(user => this.user = user)
    )
  }

  onLoanSelected(index: number ){ 
    this._loanService.setLoanSub(this.loans[index]);
    this.router.navigate(["/loans"])
  };

  getLoans(){
    const loansSub: Loan[] = this._loanService.loansSub.getValue();

    if(loansSub.length !== 0){
      this.getSubLoans();
    } else {
      this.getReqLoans();
    }

  }

  getSubLoans(){
    const loanSub: Loan = this._loanService.loanSub.getValue();

    this._loanService.getLoansSub()
        .subscribe(loans => {
          this.loans = loans;

          if(!Object(loanSub).keys){
            this._loanService.setLoanSub(loans[0]);
          }
        })
  }

  getReqLoans(){
    // const loanSub: Loan = this._loanService.loanSub.getValue();

    this._loanService.getLoans()
        .subscribe(loans => {
          this.loans = loans;
          console.log("loans getReqLoans: ", loans)
          this._loanService.setLoansSub(loans);

          if(loans.length !== 0){
          // if(loans.length !== 0 && !Object(loanSub).keys){
            this._loanService.setLoanSub(this.loans[0]);
          };
        })
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}
