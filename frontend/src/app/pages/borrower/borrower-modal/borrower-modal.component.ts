import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BorrowerService } from 'src/app/_services/borrower/borrower.service';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Loan } from '../../loan/loan';
import { Borrower } from '../borrower';

@Component({
  selector: 'app-borrower-modal',
  templateUrl: './borrower-modal.component.html',
  styleUrls: ['./borrower-modal.component.css']
})
export class BorrowerModalComponent implements OnInit, OnDestroy {
  displayStyle = "block";
  @Input() mode = "";
  @Input() borrower = {} as Borrower;
  @Input() loan = {} as Loan;
  @Output() modalSaveBorrower = new EventEmitter<Borrower|null>();
  @Output() modalSaveLoanBorrower = new EventEmitter<Borrower|null>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  @Output() removeIsConfirmed = new EventEmitter<Loan | null>()
  borrowers: Borrower[] = [];
  errors: string[] = new Array();
  form: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });
  get name(){
    return this.form.get('name')
  };
  previous = '';

  borrowerForm: FormGroup = this.fb.group({
    borrower: [null, Validators.required]
  });
  private subscr: Subscription = Subscription.EMPTY
  
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
    this.initBorrowerForm();
    this.getBorrowers();
    this.getLoanSub();
    console.log("mode:", this.mode);
  }

  initForm(){
    const name:string|null = this.borrower.name;
    if(name){
      this.form.controls['name'].setValue(name);
    };
  }

  initBorrowerForm(){
    if(Object.keys(this.borrower).length != 0){
      this.borrowerForm.patchValue({'borrower': this.borrower})
    } else {
      this.borrowerForm.setValue({'borrower': null})
    }
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

          if(this.previous === 'add'){
            this.saveLoanBorrower(borrower);
            this.previous = '';
          }
        })
        .catch(err => this.errors = err)
    }
  };

  onCancel(){
    if(this.previous === 'add'){
      this.mode = 'add';
      this.previous = '';
    } else {
      this.modalSaveBorrower.emit(null);
      this.modalSaveLoanBorrower.emit(null);
      this.removeIsConfirmed.emit(null);
    }
  };

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.previous = '';
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
      this.saveLoanBorrower(borrower);
    }
  }

  saveLoanBorrower(borrower: Borrower){
      this.loan.borrower = borrower;
      this._loanService.updateLoan(this.loan)
        .then((res) => {
          let loan: Loan = res.response;
          this.modalSaveLoanBorrower.emit(loan.borrower);
        })
  }

  removeBorrower(){
    this.loan.borrower = undefined;
    this._loanService.updateLoan(this.loan)
        .then((res) => {
          let loan: Loan = res.response;
          this.removeIsConfirmed.emit(loan);
        })

  }

  getLoanSub(){
    this.subscr = this._loanService.getLoanSub()
      .subscribe((loan) => this.loan = loan)
  };

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  };

  onAddNew(){
    this.mode = 'new';
    this.previous = 'add'
  }

  compareBorrower(b1: Borrower, b2: Borrower): boolean {
    return b1 && b2 ? b1.id === b2.id: b1 === b2
  }

}
