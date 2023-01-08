import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from './loan';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  arrowRightBlack = "assets/images/arrowRightBlack.svg";
  buttonPlus = "assets/images/buttonPlus.svg";
  loans: Loan[] = [];
  loanSelected = {} as Loan;
  loanHovered = {} as Loan;
  indexHover = 0;
  openLoanModal = false;
  isCreate = false;
  indexLoan = -1;
  tabActive = '';
  overflowAuto = false;
  private subscr: Subscription = Subscription.EMPTY

  constructor(
    private _loanService: LoanService
  ) { 
  }

  ngOnInit(): void { 
    this.getLoans();
    this.isTabCollapsed();
    // this.setTabSub(this.tabActive);
    this.getLoanTabActive();
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
        };

        this._loanService.setLoanSub(this.loanSelected);

      })
  };

  isTabCollapsed(){
    this.subscr = this._loanService.getLoanTabSub()
      .subscribe((bool) => this.isCollapsed = bool)
  }

  collapseTab(){
    this._loanService.setLoanTabSub(true)
  }
  expandTab(){
    this._loanService.setLoanTabSub(false)
  }
  setTabSub(tabActive: string){
    this.tabActive = tabActive;
    this._loanService.setLoanTabActiveSub(tabActive);
  }
  getLoanTabActive(){
    this._loanService.getLoanTabActiveSub()
      .subscribe((tabActive) => {
        this.tabActive = tabActive;

        if(tabActive === ''){
          this.tabActive = 'stakeholders'
        }
      })
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
        this.loans.unshift(loan);
      } else {
        this.loans[this.indexLoan] = loan
      }

    };

    this.indexLoan = -1;
  };

  onLoanSelected(index: number ){ 
    this.loanSelected = this.loans[index];
    this.indexLoan = index;
    this._loanService.setLoanSub(this.loanSelected);
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

  onMouseEnter(i: number){
    this.loanHovered = this.loans[i];
  }
  onMouseLeave(){
    this.loanHovered = {} as Loan;
  }

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  }


}
