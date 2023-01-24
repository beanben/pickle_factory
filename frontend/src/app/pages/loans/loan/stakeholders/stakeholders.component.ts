import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Borrower } from '../../../borrowers/borrower/borrower';
import { Loan } from '../loan';

@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css']
})
export class StakeholdersComponent implements OnInit {
  tabActive = "funders";
  openAddBorrowerModal = false;
  openRemoveBorrowerModal = false;
  openBorrowerModal = false;
  @Input() loan = {} as Loan;
  mode = '';
  
  constructor(
    private _loanService: LoanService
  ) {
   }

  ngOnInit(): void {

  }

  onSave(borrower: Borrower | null){
    this.openBorrowerModal = false
    
    if(borrower){
      this.loan.borrower = borrower;
    }
  }

  onOpenBorrowerModal(mode: string){
    this.openBorrowerModal = true;
    this.mode = mode;
  }
  // onOpenCreate(){
  //   this.openAddBorrowerModal = true;
  // }

  // getLoanSub(){
  //   this.subscr = this._loanService.getLoanSub()
  //     .subscribe((loan) => {
  //         this.loan = loan;
  //     })
  // }


  // ngOnDestroy(): void {
  //   if(this.subscr){
  //     this.subscr.unsubscribe()
  //   }
  // }

  // onRemove(loan:Loan | null){
  //   this.openRemoveBorrowerModal = false;
  // }

  

}
