import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Borrower } from '../../borrower/borrower';
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

  onSave(borrower: Borrower | null){
    this.openBorrowerModal = false;
    this.openAddBorrowerModal = false;

    if(borrower){
      this.loan.borrower = borrower;
    }
  }

  onOpenCreate(){
    this.openBorrowerModal = true;
  }

  getLoanSub(){
    this.subscr = this._loanService.getLoanSub()
      .subscribe((loan) => {
          this.loan = loan;
      })
  }


  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  }

  onRemove(loan:Loan | null){
    this.openRemoveBorrower = false;
  }

  

}
