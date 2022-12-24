import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from './loan';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  isCollapsed = false;
  arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  loans: Loan[] = [];
  loanSelected = {} as Loan;
  openLoanModal = false;
  isCreate = false;
  indexLoan = -1;

  constructor(
    private _loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.getLoans();
  }

  getLoans(){
    this._loanService.getLoans()
      .subscribe((loans) => {
        this.loans = loans;

        if(loans.length !=0 ) {
          this.loanSelected = loans[0];
        }
      })
  };

  onOpenCreate(){
    this.loanSelected = {} as Loan;
    this.openLoanModal = true;
    this.isCreate = true;
  }

  onSave(loan: Loan | null){
    this.openLoanModal = false;
    if(!!loan){
      this.loanSelected = loan;

      if(this.indexLoan === -1 ){ 
        this.loans.push(loan);
      } else {
        this.loans[this.indexLoan] = loan
      }
    };

    this.indexLoan = -1;
  };

  onLoanSelected(index: number ){ 
    this.loanSelected = this.loans[index];
    this.indexLoan = index;
  };


}
