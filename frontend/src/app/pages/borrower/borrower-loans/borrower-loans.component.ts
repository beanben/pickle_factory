import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BorrowerService } from 'src/app/_services/borrower/borrower.service';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../../loan/loan';
import { Borrower } from '../borrower';

@Component({
  selector: 'app-borrower-loans',
  templateUrl: './borrower-loans.component.html',
  styleUrls: ['./borrower-loans.component.css']
})
export class BorrowerLoansComponent implements OnInit{
  borrower = {} as Borrower;
  private subscr: Subscription = Subscription.EMPTY
  loans: Loan[] = [];

  constructor(
    private _borrowerService: BorrowerService,
    private _loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.getBorrowerSub()
  }

  getBorrowerSub(){
    this.subscr = this._borrowerService.getBorrowerSub()
      .subscribe((borrower) => {

        if(Object.keys(borrower).length !=0 ){
          this.borrower = borrower;
        }
      })
  }

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  }

  onSelectLoan(loan: Loan){
    this._loanService.setLoanSub(loan);
  }

  // getBorrowerLoans(borrower: Borrower){
  //   this._borrowerService.getBorrowerLoans(borrower)
  //     .subscribe((loans)=> {
  //       this.loans = loans;
  //       console.log("getBorrowerLoans:", loans)
  //     })
  // }  

}
