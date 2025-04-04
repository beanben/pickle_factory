import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoanService } from 'src/app/_services/loan/loan.service';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Scheme } from 'src/app/_interfaces/scheme.interface';
import { Loan } from 'src/app/_interfaces/loan.interface';


@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
})
export class LoanComponent implements OnInit, OnDestroy {
  tabActive = 'scheme';
  openSchemeModal = false;
  openLoanModal = false;
  modalMode = '';

  loanSchemes: Scheme[] = [];
  loan = {} as Loan;
  sub = Subscription.EMPTY;

  constructor(private _loanService: LoanService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this._loanService.getLoanSub().subscribe((loan) => {
      this.loan = loan;
      if (loan) {
        this.getLoanSchemes(loan);
      }
    });
  }

  deleteScheme(scheme: Scheme) {
    const indexScheme = this.loanSchemes.findIndex((s) => s.id === scheme.id);
    this.loanSchemes.splice(indexScheme, 1);
  }

  getLoanSchemes(loan: Loan) {
    this._loanService.getLoanSchemes(loan).subscribe((schemes) => (this.loanSchemes = schemes));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onOpenLoanModal(modalMode: string) {
    this.openLoanModal = true;
    this.modalMode = modalMode;
  }

  onDeleteLoan() {
    this.openLoanModal = false;

    let loans: Loan[] = this._loanService.loansSub.getValue();
    const index: number = loans.findIndex((loan) => (loan.id = this.loan.id));
    loans.splice(index, 1);

    this._loanService.setLoansSub(loans);
    this._loanService.setLoanSub(loans.length > 0 ? loans[0] : ({} as Loan));

    this.router.navigate(['/']);
  }

  onSaveLoan(loan: Loan | null) {
    this.openLoanModal = false;

    if (!!loan) {
      this._loanService.setLoanSub(loan);
      this.loan = loan;
    }
  }

  onSaveScheme(scheme: Scheme | null) {
    this.openSchemeModal = false;

    if (!!scheme) {
      const indexScheme = this.loanSchemes.findIndex((s) => s.id === scheme.id);

      if (indexScheme === -1) {
        this.loanSchemes.unshift(scheme);
      } else {
        this.loanSchemes[indexScheme] = scheme;
      }
    }
  }

  onOpenSchemeModal(modalMode: string) {
    this.openSchemeModal = true;
    this.modalMode = modalMode;
  }
}
