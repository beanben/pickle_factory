import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from './loan';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit, OnDestroy {
  tabActive = 'scheme';
  loanSchemesExist = false;

  loan = {} as Loan;
  sub = Subscription.EMPTY;

  constructor(
    private _loanService: LoanService,
    private route: ActivatedRoute,
  ) { 
  }

  ngOnInit(): void { 
    this.sub = this._loanService.getLoanSub()
      .subscribe(loan => {
        this.loan = loan;
      })

  }

   deleteScheme(index: number){
    this.loan.schemes.splice(index,1)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
