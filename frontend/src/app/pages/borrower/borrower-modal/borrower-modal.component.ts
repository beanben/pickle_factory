import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BorrowerService } from 'src/app/_services/borrower/borrower.service';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../../loan/loan';
import { Borrower } from '../borrower';

@Component({
  selector: 'app-borrower-modal',
  templateUrl: './borrower-modal.component.html',
  styleUrls: ['./borrower-modal.component.css']
})
export class BorrowerModalComponent implements OnInit {
  displayStyle = "block";
  @Input() mode = "";
  @Input() borrower = {} as Borrower;
  loan = {} as Loan;
  @Output() modalSaveBorrower = new EventEmitter<Borrower|null>();
  @Output() modalSaveLoanBorrower = new EventEmitter<Borrower|null>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  borrowers: Borrower[] = [];
  errors: string[] = new Array();
  form: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });
  get name(){
    return this.form.get('name')
  };

  borrowerForm: FormGroup = this.fb.group({
    borrower: [null, Validators.required]
  });
  
  constructor(
    private fb: FormBuilder,
    private _borrowerService: BorrowerService,
    private el: ElementRef,
    private _loanService: LoanService
  ) { 
    this.addEventBackgroundClose();
  }

  ngOnInit(): void {
    this.getMode();
    this.initForm();
    this.getBorrowers();
    this.getLoanSub();
  }

  initForm(){
    const name:string|null = this.borrower.name;
    if(name){
      this.form.controls['name'].setValue(name);
    };
  }

  getMode(){
    if(this.mode ==="") {
      if(this.borrower.id){
        this.mode = "edit";
      } else {
        this.mode = "new"
      }
    }
  }

  onSave(){
    if(this.form.valid){
      this.borrower.name = this.name?.value;
      
      if(this.borrower.id) {
        var req = this._borrowerService.updateBorrower(this.borrower)
      } else {
        var req = this._borrowerService.createBorrower(this.borrower)
      };

      req.then((result) => {
          let borrower: Borrower = result.response;
          this.modalSaveBorrower.emit(borrower);
        })
        .catch(err => this.errors = err)
    }
  };

  onCancel(){
    this.modalSaveBorrower.emit(null);
    this.modalSaveLoanBorrower.emit(null);
  };

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.onCancel();
      }
    });
  };

  onConfirmDelete(){
    this._borrowerService.deleteBorrower(this.borrower)
      .subscribe(() =>  this.deleteIsConfirmed.emit())
  }


  getBorrowers(){
    this._borrowerService.getBorrowers()
      .subscribe((borrowers) => {
        this.borrowers = borrowers;
    })
  }

  onSaveSelected(){
    if(this.borrowerForm.valid ){
      let borrower: Borrower = this.borrowerForm.get('borrower')!.value;

      this.loan.borrower = borrower;
      this._loanService.updateLoan(this.loan)
        .then((res) => {
          let loan: Loan = res.response;
          this.modalSaveLoanBorrower.emit(loan.borrower);
        })
    }
  }

  getLoanSub(){
    this._loanService.getLoanSub()
      .subscribe((loan) => this.loan = loan)
  }

}
