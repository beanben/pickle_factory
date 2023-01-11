import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../loan/loan';
import { Scheme } from './scheme';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit {
  openSchemeModal = false;
  @Input() loan = {} as Loan;
  @Input() scheme = {} as Scheme;
  exist = false;
  tabActive = "units";
  @Input() index = -1;
  @Output() deleteConfirmed = new EventEmitter<number>();

  constructor(
    private _loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.scheme.loan_id = this.loan.id
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

  

  
  

}
