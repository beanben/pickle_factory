import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BorrowerService } from 'src/app/_services/borrower/borrower.service';
import { Borrower } from './borrower/borrower';

@Component({
  selector: 'app-borrowers',
  templateUrl: './borrowers.component.html',
  styleUrls: ['./borrowers.component.css']
})
export class BorrowersComponent implements OnInit, OnDestroy {
  // isCollapsed = true;
  // openBorrowerModal = false;
  // indexBorrower = -1;
  // modalMode = "";

  // arrowLeftBlack = "assets/images/arrowLeftBlack.svg";
  // arrowRightBlack = "assets/images/arrowRightBlack.svg";
  // buttonPlus = "assets/images/buttonPlus.svg";

  // borrowerSelected = {} as Borrower;
  // borrowerHovered = {} as Borrower;
  // borrowers: Borrower[] = [];
  subs: Subscription[] = [];

  // constructor(
  //   private _borrowerService: BorrowerService,
  //   private route: ActivatedRoute,
  //   private router: Router
  // ) { }

  ngOnInit(): void {
    // this.subs.push(
    //   this._borrowerService.getBorrowerSub()
    //     .subscribe(borrower => this.borrowerSelected = borrower)
    // );

    // this.getBorrowers();
  }

  // onOpenModal(modalMode: string){
  //   this.openBorrowerModal = true;
  //   this.modalMode = modalMode;

  //   if(modalMode == "new"){
  //     this.borrowerSelected = {} as Borrower;
  //   }
  // }

  // onBorrowerSelected(index: number ){ 
  //   this._borrowerService.setBorrowerSub(this.borrowers[index])
  //   this.indexBorrower = index;
  // };

  // onMouseEnter(i: number){
  //   this.borrowerHovered = this.borrowers[i];
  // }
  // onMouseLeave(){
  //   this.borrowerHovered = {} as Borrower;
  // };

  // onSave(borrower: Borrower | null){
  //   this.router.navigate(['/borrowers']);
  //   this.openBorrowerModal = false;

  //   if(!!borrower){
  //     this._borrowerService.setBorrowerSub(borrower);


  //     if(this.indexBorrower === -1 ){ 
  //       this.borrowers.unshift(borrower);

  //     } else {
  //       this.borrowers[this.indexBorrower] = borrower
  //       this.indexBorrower === -1
  //     }
  //   }
  // };

  // removeBorrower(i: number){
  //   this.borrowers.splice(i,1)
  // }

  // onDeleteBorrower(){
  //   this.openBorrowerModal = false;
  //   this.removeBorrower(this.indexBorrower);
  //   this.indexBorrower = -1;

  //   if(this.borrowers.length !=0 ) {
  //     this._borrowerService.setBorrowerSub(this.borrowers[0]);
  //   } 
  // }

  // getBorrowers(){
  //   const borrowersSub: Borrower[] = this._borrowerService.borrowersSub.getValue();

  //   let borrowersObs: Observable<Borrower[]> = borrowersSub.length === 0
  //     ? this._borrowerService.getBorrowers()
  //     : this._borrowerService.getBorrowersSub();

  //   this.subs.push(
  //     borrowersObs.subscribe(borrowers => {
  //       this.borrowers = borrowers;

  //       if(Object.keys(borrowersSub).length === 0 && borrowers.length !== 0){
  //         this._borrowerService.setBorrowerSub(borrowers[0]);
  //       }

  //       if (borrowersSub.length === 0) {
  //         this._borrowerService.setBorrowersSub(borrowers);
  //       }
  //     })
  //   )
  // };

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}
