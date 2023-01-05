import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BorrowerService } from 'src/app/_services/borrower/borrower.service';
import { Borrower } from './borrower';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit {
  isCollapsed = false;
  arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  arrowRightBlack = "assets/images/arrowRightBlack.svg";
  buttonPlus = "assets/images/buttonPlus.svg";
  borrowers: Borrower[] = [];
  borrowerSelected = {} as Borrower;
  borrowerHovered = {} as Borrower;
  indexHover = 0;
  openBorrowerModal = false;
  isCreate = false;
  indexBorrower = -1;
  overflowAuto = false;
  tabActive = "loans";
  private subscr: Subscription = Subscription.EMPTY

  constructor(
    private _borrowerService: BorrowerService
  ) { }

  ngOnInit(): void {
    this.getBorrowers();
    this.isTabCollapsed();
  }

  getBorrowers(){
    this._borrowerService.getBorrowers()
      .subscribe((borrowers) => {
        this.borrowers = borrowers;

        let borrowerSaved = this._borrowerService.borrowerSub.value;

        if(Object.keys(borrowerSaved).length === 0){
          this.borrowerSelected = borrowers[0]
        } else {
          this.borrowerSelected = this._borrowerService.borrowerSub.value;
        }

        this._borrowerService.setBorrowerSub(this.borrowerSelected);

      })
  };

  isTabCollapsed(){
    this.subscr = this._borrowerService.getBorrowerTabSub()
      .subscribe((bool) => this.isCollapsed = bool)
  }

  collapseTab(){
    this._borrowerService.setBorrowerTabSub(true)
  }
  expandTab(){
    this._borrowerService.setBorrowerTabSub(false)
  }

  onOpenCreate(){
    this.borrowerSelected = {} as Borrower;
    this.openBorrowerModal = true;
    this.isCreate = true;
  }

  onSave(borrower: Borrower | null){
    this.openBorrowerModal = false;
    if(!!borrower){
      this.borrowerSelected = borrower;

      if(this.indexBorrower === -1 ){ 
        this.borrowers.splice(0,0, borrower)
      } else {
        this.borrowers[this.indexBorrower] = borrower
      }

    };

    this.indexBorrower = -1;
  };

  onBorrowerSelected(index: number ){ 
    this.borrowerSelected = this.borrowers[index];
    this.indexBorrower = index;
    this._borrowerService.setBorrowerSub(this.borrowerSelected);
  };

  removeBorrower(i: number){
    this.borrowers.splice(i,1)
  };

  onDeleteBorrower(){
    this.openBorrowerModal = false;
    this.removeBorrower(this.indexBorrower);

    if(this.borrowers.length !=0 ) {
      this.borrowerSelected = this.borrowers[0];
    };
  }

  onMouseEnter(i: number){
    this.borrowerHovered = this.borrowers[i];
  }
  onMouseLeave(){
    this.borrowerHovered = {} as Borrower;
  };

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe()
    }
  }

}
