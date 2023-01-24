import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BorrowerService } from 'src/app/_services/borrower/borrower.service';
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
    private _borrowerService: BorrowerService,
    private _loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  onNavigate(loan: Loan){
    this._loanService.setLoanSub(loan);
    this.router.navigate(["/loans"])
  }


}
