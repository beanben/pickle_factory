import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit {
  // tabActive = "loans";
  // openBorrowerModal = false;
  // modalMode = "";
  // @Input() borrower = {} as Borrower;

  // constructor(
  //   private _loanService: LoanService,
  //   private _borrowerService: BorrowerService,
  //   private router: Router
  // ) { }

  ngOnInit(): void {
  }

  // onNavigate(loan: Loan){
  //   this._loanService.setLoanSub(loan);
  //   this.router.navigate(["/loans"])
  // }

  // onOpenModal(modalMode: string){
  //   this.openBorrowerModal = true;
  //   this.modalMode = modalMode;
  // }

  // onSave(borrower: Borrower | null){
  //   this.openBorrowerModal = false;

  //   if(!!borrower){
  //     this._borrowerService.setBorrowerSub(borrower);
  //     this.borrower = borrower;
  //   }
  // }

  // onDeleteBorrower(){
  //   this.openBorrowerModal = false;

  //   let borrowers: Borrower[] = this._borrowerService.borrowersSub.getValue();
  //   const index: number = borrowers.findIndex(borrower => borrower.id = this.borrower.id);
  //   borrowers.splice(index, 1);

  //   this._borrowerService.setBorrowersSub(borrowers);
  //   this._borrowerService.setBorrowerSub(borrowers.length > 0 ? borrowers[0] : {} as Borrower);

  //   this.router.navigate(["/"]);
  // }


}
