import { Component, Input, OnInit } from '@angular/core';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../loan';

@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css']
})
export class StakeholdersComponent implements OnInit {
  tabActive = "funders";
  openBorrowerModal = false;
  loan = {} as Loan;
  
  constructor(
    private _loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.getLoanSub();
  }

  onSave(loan: Loan | null){
    this.openBorrowerModal = false;
  }

  onOpenCreate(){
    this.openBorrowerModal = true;
  }

  getLoanSub(){
    this._loanService.getLoanSub()
      .subscribe((loan) => {
        this.loan = loan;
      })
  }

  

}
