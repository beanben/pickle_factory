import { Component, OnDestroy, OnInit } from '@angular/core';
import { empty, EMPTY, Observable, of, Subscription} from 'rxjs';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from './loan/loan';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  openLoanModal = false;
  indexLoan = -1;
  modalMode = "";

  arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  arrowRightBlack = "assets/images/arrowRightBlack.svg";
  buttonPlus = "assets/images/buttonPlus.svg";

  loanSelected = {} as Loan;
  loanHovered = {} as Loan;
  loans: Loan[] = [];
  loanSlug = "";
  subs: Subscription[] = []

  constructor(
    private _loanService: LoanService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this._loanService.getLoanSub()
        .subscribe(loan => {
          this.loanSelected = loan;

        })
    )
    
    if(this._authService.isLoggedIn()){
      this.getLoans();
    }

    

  }

  onOpenModal(modalMode: string){
    this.openLoanModal = true;
    this.modalMode = modalMode;

    if(modalMode == "new"){
      this.loanSelected = {} as Loan;
    }
  }


  getLoan(loanSlug:string){
    this._loanService.getLoan(loanSlug)
    .subscribe(loan => {
      this._loanService.setLoanSub(loan);
    })
  }

  getLoans(){
    const loansSub: Loan[] = this._loanService.loansSub.getValue();
    
    let loansObs: Observable<Loan[]> = loansSub.length === 0 
      ? this._loanService.getLoans()
      : this._loanService.getLoansSub();


    this.subs.push(
      loansObs.subscribe(loans => {
          this.loans = loans;

          if(Object.keys(this._loanService.loanSub.getValue()).length === 0 && this.loans.length !== 0){
            this._loanService.setLoanSub(loans[0]);
          }

          if (loansSub.length === 0) {
            this._loanService.setLoansSub(loans);
          }
        })
    )

    // this._loanService.getLoans()
    // .subscribe(loans => {
    //   this.loans = loans;

    //   if(Object.keys(this._loanService.loanSub.getValue()).length === 0 && this.loans.length != 0){
    //     this._loanService.setLoanSub(loans[0]);
    //   }
    // })
  }

  onLoanSelected(index: number ){ 
    this._loanService.setLoanSub(this.loans[index]);
    this.indexLoan = index;
  };

  onMouseEnter(i: number){
    this.loanHovered = this.loans[i];
  }
  onMouseLeave(){
    this.loanHovered = {} as Loan;
  }

  onSave(loan: Loan | null){
    this.openLoanModal = false;

    if(!!loan){
      this._loanService.setLoanSub(loan);

      if(this.indexLoan === -1 ){ 
        this.loans.unshift(loan);

      } else {
        this.loans[this.indexLoan] = loan
        this.indexLoan === -1
      }

    }
  }

  removeLoan(i: number){
    this.loans.splice(i,1)
  }

  onDeleteLoan(){
    this.openLoanModal = false;
    this.removeLoan(this.indexLoan);
    this.indexLoan = -1;

    if(this.loans.length !=0 ) {
      this._loanService.setLoanSub(this.loans[0]);

    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}
