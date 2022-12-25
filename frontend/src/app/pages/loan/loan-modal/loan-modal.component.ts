import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../loan';

@Component({
  selector: 'app-loan-modal',
  templateUrl: './loan-modal.component.html',
  styleUrls: ['./loan-modal.component.css']
})
export class LoanModalComponent implements OnInit {
  displayStyle = "block";
  mode = "";
  @Output() modalSaveLoan = new EventEmitter<Loan|null>();
  loan = {} as Loan;
  errors: string[] = new Array();
  form: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });
  get name(){
    return this.form.get('name')
  };

  constructor(
    private fb: FormBuilder,
    private _loanService: LoanService,
    private el: ElementRef
  ) { 
    this.addEventBackgroundClose();
  }

  ngOnInit(): void {
    this.getMode();
  }

  getMode(){
    if(this.loan.id){
      this.mode = "edit";
    } else {
      this.mode = "new"
    }
  }

  onSave(){
    if(this.form.valid){
      this.loan.name = this.name?.value;

      this._loanService.createLoan(this.loan)
        .then((result) => {
          let loan: Loan = result.response;
          this.modalSaveLoan.emit(loan);
        })
        .catch(err => this.errors = err)
    }
  };

  onCancel(){
    this.modalSaveLoan.emit(null);
  };

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.onCancel();
      }
    });
  };


}
