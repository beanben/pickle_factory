import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Loan } from 'src/app/pages/loans/loan/loan';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  relativeUrl = "/api/loan";
  loanSub = new BehaviorSubject<Loan>({} as Loan);

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }
  
  getLoanSub():Observable<Loan>{
    return this.loanSub.asObservable() 
  }
  setLoanSub(loan: Loan){
    return this.loanSub.next(loan);
  }


  createLoan(loan: Loan) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.relativeUrl}/`;

      this.http.post(url, loan).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },
        error: (error) => {
          reject(this._sharedService.handleError(error));
        }
      })
    })
  };

  updateLoan(loan: Loan){
    const url = `${this.relativeUrl}/${loan.slug}/`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(url, loan).subscribe({
        next: (data) => {
          const result = data as APIResult;

          if (result.status === "success"){
            resolve(result);
          } else {
            reject(result.message)
          }
        },

        error: (error) => {
          reject(this._sharedService.handleError(error));
        }
      })
    })
  };

  getLoans(): Observable<Loan[]> {
    const url = `${this.relativeUrl}/`;
    // console.log("getLoans url:", url);

    return this.http.get<Loan[]>(url)
      .pipe(
        tap(() => console.log('getLoans()', Math.random()))
      )
  };


  getLoan(loanSlug: string): Observable<Loan> {
    const url = `${this.relativeUrl}/${loanSlug}/`;
    
    return this.http.get<Loan>(url)
      .pipe(
        tap(() => console.log('getLoan()', Math.random()))
      )
  };

  deleteLoan(loan: Loan): Observable<any> {
    const url = `${this.relativeUrl}/${loan.slug}/`;

    const options = {
      body: loan
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteLoan()', Math.random()))
    );
  }



}
