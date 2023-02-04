import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../../loans/loan/loan';
import { Borrower } from './borrower';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit {
  tabActive = "loans";
  @Input() borrower = {} as Borrower;

  constructor(
    private _loanService: LoanService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  onNavigate(loan: Loan){
    this._loanService.setLoanSub(loan);
    this.router.navigate(["/loans"])
  }


}
