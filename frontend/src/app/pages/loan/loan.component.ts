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
  arrowRightBlack = "assets/images/arrowRightBlack.svg";
  buttonPlus = "assets/images/buttonPlus.svg";
  loans: Loan[] = [];
  loanSelected = {} as Loan;
  openLoanModal = false;
  isCreate = false;
  indexLoan = -1;
  tabActive = 'detail';

  constructor(
    private _loanService: LoanService
  ) { }

  ngOnInit(): void { 
    this.getLoans();
    this.isTabCollapsed();
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

  isTabCollapsed(){
    this._loanService.getLoanTabSub()
      .subscribe((bool) => this.isCollapsed = bool)
    // this.isCollapsed = this._loanService.loanTabSub.value;
  }

  collapseTab(){
    this._loanService.setLoanTabSub(true)
  }
  expandTab(){
    this._loanService.setLoanTabSub(false)
  }


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
