import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, mergeMap, Subscription } from 'rxjs';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../loan';

@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css']
})
export class StakeholdersComponent implements OnInit, OnDestroy {
  tabActive = "funders";
  openBorrowerModal = false;
  openAddBorrowerModal = false;
  openRemoveBorrower = false;
  loan = {} as Loan;
  mode = '';
  private subscr: Subscription = Subscription.EMPTY;
  
  constructor(
    private _loanService: LoanService
  ) {
   }

  ngOnInit(): void {
    this.getLoanSub();
  }

  onSave(loan: Loan | null){
    this.openBorrowerModal = false;
    this.openAddBorrowerModal = false
  }

  onOpenCreate(){
    this.openBorrowerModal = true;
  }

  getLoanSub(){
    this.subscr = this._loanService.getLoanSub()
      .subscribe((loan) => {
        
        if(!loan.borrower && !!loan.id){
          this.getLoan(loan);
        } else {
          this.loan = loan;
        }
      })
  }

  getLoan(loan: Loan){
    this._loanService.getLoan(loan)
      .subscribe((loan) => {
        this.loan = loan;
      })
  }

  // getLoanSub(){
  //   this.subscr = this._loanService.getLoanSub()
  //     .pipe(
  //       map(loan => {return loan}),
  //       mergeMap(loan => {
  //         if(!loan.borrower && !!loan.id){
  //           return this._loanService.getLoan(loan)
  //         }
  //       })
  //     )
  //     .subscribe( loan => this.loan = loan)
  // }


  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  }

  onRemove(loan:Loan | null){
    this.openRemoveBorrower = false;
  }

  

}
