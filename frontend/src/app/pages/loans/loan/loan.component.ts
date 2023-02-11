import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from './loan';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit, OnDestroy {
  tabActive = 'scheme';
  loanSchemesExist = false;
  openSchemeModal = false;
  openLoanModal = false;
  modalMode = "";

  loan = {} as Loan;
  loanSelected = {} as Loan;
  sub = Subscription.EMPTY;

  constructor(
    private _loanService: LoanService,
    private router: Router
  ) { 
  }

  ngOnInit(): void { 
    this.sub = this._loanService.getLoanSub()
      .subscribe(loan => {
        this.loan = loan;
        // console.log("loan:", loan);
      })

  }

   deleteScheme(index: number){
    this.loan.schemes.splice(index,1)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  onOpenModal(modalMode: string){
    this.openLoanModal = true;
    this.modalMode = modalMode;
  }

  onDeleteLoan(){
    this.openLoanModal = false;
    
    let loans: Loan[] = this._loanService.loansSub.getValue();
    const index: number = loans.findIndex(loan => loan.id = this.loan.id);
    loans.splice(index, 1);

    this._loanService.setLoansSub(loans);
    this._loanService.setLoanSub(loans.length > 0 ? loans[0] : {} as Loan);

    this.router.navigate(["/"]);
  }



  onSave(loan: Loan | null){
    this.openLoanModal = false;

    if(!!loan){
      this._loanService.setLoanSub(loan);
      this.loan = loan;
    }
  }

}
