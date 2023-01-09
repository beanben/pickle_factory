import { Component, Input, OnInit } from '@angular/core';
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
  loan = {} as Loan;
  @Input() scheme = {} as Scheme;
  exist = false;

  constructor(
    private _loanService: LoanService
  ) { }

  ngOnInit(): void {
  }

  onSave(scheme: Scheme | null){
    this.openSchemeModal = false;
    
    if(scheme){
      this.scheme = scheme;
    }  
  }

  
  

}
