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
  sub = Subscription.EMPTY
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
    
    this.sub = this._authService.getUserSub()
      .subscribe(user => {
        this.user = user;
      })

  }


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
    this.sub.unsubscribe();
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
