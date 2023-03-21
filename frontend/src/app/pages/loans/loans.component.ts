import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription} from 'rxjs';
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
  loanSlug = "";
  isCreateNewLoan = false

  arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  arrowRightBlack = "assets/images/arrowRightBlack.svg";
  buttonPlus = "assets/images/buttonPlus.svg";

  loanSelected = {} as Loan;
  loanHovered = {} as Loan;
  loans: Loan[] = [];
  subs: Subscription[] = [];

  constructor(
    private _loanService: LoanService,
    private _authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isCreateNewLoan = this.route.snapshot.params['new'] ? true : false;
    if(this.isCreateNewLoan) {

      // CONTINUE HERE
     
      this.onOpenModal('new');
      console.log("this.modalMode:", this.modalMode)
    };

    if(this._authService.isLoggedIn()){
      this.getLoan();
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

  getLoans(){
    const loansSub: Loan[] = this._loanService.loansSub.getValue();

    if(loansSub.length !== 0){
      this.getSubLoans();
    } else {
      this.getReqLoans();
    }
  }

  getSubLoans(){
    this._loanService.getLoansSub()
        .subscribe(loans => {
          this.loans = loans;

          const loanSub: Loan = this._loanService.loanSub.getValue();
          if(loans.length !== 0 && Object.keys(loanSub).length === 0){
            this.loanSelected = loans[0];
            this._loanService.setLoanSub(this.loanSelected);
          }
        })
  }
  getReqLoans(){
    this._loanService.getLoans()
        .subscribe(loans => {
          this.loans = loans;
          this._loanService.setLoansSub(loans);

          if(loans.length !== 0){
            this.loanSelected = loans[0];
            this._loanService.setLoanSub(this.loanSelected);
          };
    });
  }

  getLoan(){
    this.subs.push(
      this._loanService.getLoanSub()
        .subscribe(loan => {
          this.loanSelected = loan;
        })
    );
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
