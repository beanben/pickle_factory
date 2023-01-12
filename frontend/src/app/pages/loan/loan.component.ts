import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Scheme } from '../scheme/scheme';
import { Loan } from './loan';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit, OnDestroy {
  tabActive = 'scheme'

  private subscr: Subscription = Subscription.EMPTY
  loan = {} as Loan;

  constructor(
    private _loanService: LoanService,
    private route: ActivatedRoute
  ) { 
  }

  ngOnInit(): void { 
    this.subscr = this._loanService.getloanIdSub()
      .subscribe(loanId => {
        if(loanId){
          this.getLoan(loanId)
        }
       })
  }

  getLoan(loanId:string){
    this._loanService.getLoan(loanId)
      .subscribe(loan => this.loan = loan)
  }

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  }

   deleteScheme(index: number){
    this.loan.schemes.splice(index,1)
  }

}
