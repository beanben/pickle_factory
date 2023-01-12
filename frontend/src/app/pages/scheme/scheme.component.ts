import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../loan/loan';
import { Scheme } from './scheme';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit,  OnDestroy{
  openSchemeModal = false;
  loan = {} as Loan;
  // @Input() loan = {} as Loan;
  @Input() scheme = {} as Scheme;
  exist = false;
  tabActive = "units";
  @Input() index = -1;
  @Output() deleteConfirmed = new EventEmitter<number>();
  private subscr: Subscription = Subscription.EMPTY;

  constructor(
    private _loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.getLoanSub();
  }

  onSave(scheme: Scheme | null){
    this.openSchemeModal = false;
    
    if(scheme){
      this.scheme = scheme;
    }  
  }

  onDeleteScheme(){
    this.openSchemeModal = false;
    this.deleteConfirmed.emit(this.index);
  }

  getLoanSub(){
    this.subscr = this._loanService.getLoanSub()
      .subscribe((loan) => {
          this.loan = loan;

          if(this.loan){
            this.scheme.loan_id = this.loan.id
          };
          console.log("this.loan:", this.loan) ;
      })
  }

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  }
  

}
