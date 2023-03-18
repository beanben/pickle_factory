import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Borrower } from '../../../borrowers/borrower/borrower';
import { Loan } from '../loan';

@Component({
  selector: 'app-funders',
  templateUrl: './funders.component.html',
  styleUrls: ['./funders.component.css']
})
export class FundersComponent implements OnInit {
  tabActive = "funders";
  openAddBorrowerModal = false;
  openRemoveBorrowerModal = false;
  openBorrowerModal = false;
  @Input() loan = {} as Loan;
  mode = '';
  
  constructor(
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

}
