import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BorrowerService } from 'src/app/_services/borrower/borrower.service';
import { Borrower } from './borrower/borrower';

@Component({
  selector: 'app-borrowers',
  templateUrl: './borrowers.component.html',
  styleUrls: ['./borrowers.component.css']
})
export class BorrowersComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  openBorrowerModal = false;
  indexBorrower = -1;
  modalMode = "";

  arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  arrowRightBlack = "assets/images/arrowRightBlack.svg";
  buttonPlus = "assets/images/buttonPlus.svg";

  borrowerSelected = {} as Borrower;
  borrowerHovered = {} as Borrower;
  borrowers: Borrower[] = [];
  sub = Subscription.EMPTY;

  constructor(
    private _borrowerService: BorrowerService,
  ) { }

  ngOnInit(): void {
    this.getBorrowers();

    this.sub = this._borrowerService.getBorrowerSub()
      .subscribe(borrower => this.borrowerSelected = borrower)

  }

  onOpenModal(modalMode: string){
    this.openBorrowerModal = true;
    this.modalMode = modalMode;

    if(modalMode == "new"){
      this.borrowerSelected = {} as Borrower;
    }
  }

  onBorrowerSelected(index: number ){ 
    this._borrowerService.setBorrowerSub(this.borrowers[index])
    this.indexBorrower = index;
  };

  onMouseEnter(i: number){
    this.borrowerHovered = this.borrowers[i];
  }
  onMouseLeave(){
    this.borrowerHovered = {} as Borrower;
  };

  onSave(borrower: Borrower | null){
    this.openBorrowerModal = false;

    if(!!borrower){
      this._borrowerService.setBorrowerSub(borrower);


      if(this.indexBorrower === -1 ){ 
        this.borrowers.unshift(borrower);

      } else {
        this.borrowers[this.indexBorrower] = borrower
        this.indexBorrower === -1
      }
    }
  };

  removeBorrower(i: number){
    this.borrowers.splice(i,1)
  }

  onDeleteBorrower(){
    this.openBorrowerModal = false;
    this.removeBorrower(this.indexBorrower);
    this.indexBorrower = -1;

    if(this.borrowers.length !=0 ) {
      this._borrowerService.setBorrowerSub(this.borrowers[0]);
    } 
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  getBorrowers(){
    this._borrowerService.getBorrowers()
      .subscribe((borrowers) => {
        this.borrowers = borrowers;

        if(this.borrowers.length !==0){
          this._borrowerService.setBorrowerSub(this.borrowers[0]);
        }
      })
  };

}
