import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { Loan } from 'src/app/_interfaces/loan.interface';
import { Scheme } from 'src/app/_interfaces/scheme.interface';
import { APIResult } from 'src/app/_interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  relativeUrl = "/api/loan";
  loanSub = new BehaviorSubject<Loan>({} as Loan);
  loansSub = new BehaviorSubject<Loan[]>([] as Loan[]);

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
  
  getLoansSub():Observable<Loan[]>{
    return this.loansSub.asObservable() 
  }
  setLoansSub(loans: Loan[]){
    return this.loansSub.next(loans);
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
    const url = `${this.relativeUrl}/${loan.id}/`;

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

    return this.http.get<Loan[]>(url)
      .pipe(
        tap(() => console.log('getLoans()', Math.random()))
      )
  };

  getLoanSchemes(loan:Loan): Observable<Scheme[]> {
    const url = `${this.relativeUrl}/${loan.id}/schemes/`;

    return this.http.get<Scheme[]>(url)
      .pipe(
        tap(() => console.log('getLoanSchemes()', Math.random()))
      )
  };


  deleteLoan(loan: Loan): Observable<any> {
    const url = `${this.relativeUrl}/${loan.id}/`;

    const options = {
      body: loan
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteLoan()', Math.random()))
    );
  }



}
