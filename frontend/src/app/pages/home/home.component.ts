import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { User } from '../auth/user';
import { Loan } from '../loans/loan/loan';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  openLoanModal = false;
  isLoggedIn = false;

  user = {} as User;
  subs: Subscription[] = []
  loans: Loan[] = [];

  constructor(
    public _authService: AuthService,
    private el: ElementRef,
    private _loanService: LoanService,
    private router: Router
  ) { 
    this.addEventBackgroundClose()
  }

  ngOnInit(): void {

    if(this._authService.isLoggedIn()){
      this.getLoans();
    
      this.subs.push(
        this._authService.getUserSub()
        .subscribe(user => this.user = user)
      )
    }
  }


  closePopup(){
    this.openLoanModal = false;
  }

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.closePopup();
      }
    });
  };

  onSave(loan:Loan | null){
    this.openLoanModal = false;

    if(loan){
      this._loanService.setLoanSub(loan);
      this.router.navigate(["/loans"]);
    }
  }

  onLoanSelected(index: number ){ 
    this._loanService.setLoanSub(this.loans[index]);
    this.router.navigate(["/loans"])
  };

  getLoans(){
    const loansSub: Loan[] = this._loanService.loansSub.getValue();

    let loansObs: Observable<Loan[]> = loansSub.length === 0 
      ? this._loanService.getLoans()
      : this._loanService.getLoansSub();

    this.subs.push(
      loansObs.subscribe(loans => {
        this.loans = loans;

        if (loansSub.length === 0) {
          this._loanService.setLoansSub(loans);
        }
      })
    )
    // this._loanService.getLoans()
    // .subscribe(loans => {
    //   this.loans = loans;
    //   this._loanService.setLoansSub(loans);
    // })
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}
