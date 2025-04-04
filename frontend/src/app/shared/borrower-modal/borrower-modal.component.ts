import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-borrower-modal',
  templateUrl: './borrower-modal.component.html',
  styleUrls: ['./borrower-modal.component.css']
})
export class BorrowerModalComponent implements OnInit {
  // displayStyle = "block";
  // previous = '';
  // modalTitle = '';

  // @Input() mode = "";
  // @Input() borrower = {} as Borrower;
  // @Input() loan = {} as Loan;
  // @Output() modalSaveBorrower = new EventEmitter<Borrower|null>();
  // @Output() deleteIsConfirmed = new EventEmitter<void>();
  // @Output() removeIsConfirmed = new EventEmitter<void>();
  
  // borrowers: Borrower[] = [];
  // errors: string[] = new Array();

  // form: FormGroup = this.fb.group({
  //   name: ['', Validators.required]
  // });
  // get name(){
  //   return this.form.get('name')
  // };

  // selectForm: FormGroup = this.fb.group({
  //   borrower: [null, Validators.required]
  // });

  // constructor(
  //   private fb: FormBuilder,
  //   private _borrowerService: BorrowerService,
  //   private el: ElementRef,
  //   private _loanService: LoanService
  // ) { 
  //   this.addEventBackgroundClose();
  // }

  ngOnInit(): void {
    // this.getBorrowers();

    // if(this.mode === "selectNew" || this.mode === "selectEdit"){
    //   this.initSelectForm();
    //   this.modalTitle = this.mode === "selectNew" ? "add" : "edit";

    // } else {
    //   this.initForm();
    //   this.modalTitle = this.mode
    // }
  }

  // initForm(){
  //   if(this.borrower.name) {
  //     this.form.controls['name'].setValue(this.borrower.name);
  //   }
  // }
  // initSelectForm(){
  //   if(this.loan.borrower){
  //     this.selectForm.controls['borrower'].setValue(this.loan.borrower);
  //   }
  // }

  // onSave(){
  //   if(this.form.valid){
  //     this.borrower.name = this.name?.value;

  //     if(this.borrower.id) {
  //       var req = this._borrowerService.updateBorrower(this.borrower)
  //     } else {
  //       var req = this._borrowerService.createBorrower(this.borrower)
  //     };

  //     req.then((result) => {
  //         let borrower: Borrower = result.response;
  //         this.modalSaveBorrower.emit(borrower);

  //         if(this.previous === 'add'){
  //           this.saveLoanBorrower(borrower);
  //           this.previous = '';
  //         }
  //       })
  //       .catch(err => this.errors = err)
  //   }
  // };

  // onCancel(){
  //   if(this.previous === 'add'){
  //     this.mode = 'add';
  //     this.previous = '';
  //   } else {
  //     this.modalSaveBorrower.emit(null);
  //     this.removeIsConfirmed.emit();
  //   }
  // };

  // addEventBackgroundClose(){
  //   this.el.nativeElement.addEventListener('click', (el:any) => {
  //     if (el.target.className === 'modal') {
  //         this.previous = '';
  //         this.onCancel();
  //     }
  //   });
  // };

  // onConfirmDelete(){
  //   this._borrowerService.deleteBorrower(this.borrower)
  //     .subscribe(() =>  this.deleteIsConfirmed.emit())
  // }


  // getBorrowers(){
  //   this._borrowerService.getBorrowers()
  //     .subscribe((borrowers) => {
  //       this.borrowers = borrowers;
  //   })
  // }


  // onSaveSelected(){
  //   if(this.selectForm.valid ){
  //     let borrower: Borrower = this.selectForm.get('borrower')!.value;
  //     this.saveLoanBorrower(borrower);
  //   }
  // }

  // saveLoanBorrower(borrower: Borrower){
  //     this.loan.borrower = borrower;
  //     this._loanService.updateLoan(this.loan)
  //       .then((res) => {
  //         let loan: Loan = res.response;
  //         this.modalSaveBorrower.emit(loan.borrower);
  //       })
  // }

  // removeBorrower(){
  //   this.loan.borrower = undefined;
  //   this._loanService.updateLoan(this.loan)
  //       .then((res) => {
  //         let loan: Loan = res.response;
  //         this.removeIsConfirmed.emit();
  //       })
  // }

  // onAddNew(){
  //   this.mode = 'new';
  //   this.modalTitle = 'new';
  //   this.previous = 'selectNew';
  // }

  // compareFn(b1: Borrower, b2: Borrower): boolean {
  //   return b1 && b2 ? b1.id === b2.id: b1 === b2
  // }



}
