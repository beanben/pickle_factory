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
    // console.log("this.loanSelected:", this.loanSelected);
    // console.log(" this._loanService.loanSub.value:",  this._loanService.loanSub.value);
    // console.log(" this._loanService.loanSub.getValue():",  this._loanService.loanSub.getValue());
  }




  getLoans(){
    this._loanService.getLoans()
      .subscribe((loans) => {
        this.loans = loans;

        let loanSaved = this._loanService.loanSub.value;

        if(Object.keys(loanSaved).length === 0){
          this.loanSelected = loans[0]
        } else {
          this.loanSelected = this._loanService.loanSub.value;
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

  removeLoan(i: number){
    this.loans.splice(i,1)
  }

  onDeleteLoan(){
    this.openLoanModal = false;
    this.removeLoan(this.indexLoan);

    if(this.loans.length !=0 ) {
      this.loanSelected = this.loans[0];
    };
  }


}
