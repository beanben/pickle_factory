import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../loan/loan';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  isCollapsed = false;
  openLoanModal = false;
  isCreate = false;
  indexLoan = -1;

  arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  arrowRightBlack = "assets/images/arrowRightBlack.svg";
  buttonPlus = "assets/images/buttonPlus.svg";

  loanSelected = {} as Loan;
  loanHovered = {} as Loan;
  loans: Loan[] = [];

  constructor(
    private _loanService: LoanService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getLoans();
  }

  onOpenCreate(){
    this.loanSelected = {} as Loan;
    this.openLoanModal = true;
    this.isCreate = true;
  }

  getLoans(){
    this._loanService.getLoans()
      .subscribe(loans => {
        this.loans = loans;

        if(this.loans.length !==0){
          this.loanSelected = this.loans[0];
          this.accessLoan(this.loanSelected);
        }
      })
  };

  onLoanSelected(index: number ){ 
    this.loanSelected = this.loans[index];
    this.indexLoan = index;
    this.accessLoan(this.loanSelected);
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
      this.loanSelected = loan;

      if(this.indexLoan === -1 ){ 
        this.loans.unshift(loan);
      } else {
        this.loans[this.indexLoan] = loan
      }

    };

    this.indexLoan = -1;
    this.accessLoan(this.loanSelected);
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

  accessLoan(loan: Loan){
    let loanName: string = loan.name.split(' ').join('-').toLowerCase();
    this.router.navigate([loanName], {relativeTo: this.route});
    this._loanService.setloanIdSub(loan.id)
  }

}
