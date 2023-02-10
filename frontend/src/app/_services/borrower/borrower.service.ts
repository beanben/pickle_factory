import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Borrower } from 'src/app/pages/borrowers/borrower/borrower';

import { Loan } from 'src/app/pages/loans/loan/loan';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {
  relativeUrl = "/api/borrower";
  borrowerSub = new BehaviorSubject<Borrower>({} as Borrower);

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }


  getBorrowerSub():Observable<Borrower>{
    return this.borrowerSub.asObservable() 
  }
  setBorrowerSub(newBorrower: Borrower){
    return this.borrowerSub.next(newBorrower);
  }


  createBorrower(borrower: Borrower) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.relativeUrl}/`;

      this.http.post(url, borrower).subscribe({
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

  updateBorrower(borrower: Borrower){
    const url = `${this.relativeUrl}/${borrower.slug}/`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(url, borrower).subscribe({
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

  getBorrowers(): Observable<Borrower[]> {
    const url = `${this.relativeUrl}/`;

    return this.http.get<Borrower[]>(url)
      .pipe(
        tap(() => console.log('getBorrowers()', Math.random()))
      )
  };

  deleteBorrower(borrower: Borrower): Observable<any> {
    const url = `${this.relativeUrl}/${borrower.slug}/`;

    const options = {
      body: borrower
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteBorrower()', Math.random()))
    );
  }

  getBorrowerLoans(borrower: Borrower): Observable<Loan[]>{
    const url = `${this.relativeUrl}/${borrower.slug}`;

    return this.http.get<Loan[]>(url)
      .pipe(
        tap(() => console.log('getBorrowerLoans()', Math.random()))
      )
  };

  getBorrower(borrowerSlug: string): Observable<Borrower> {
    const url = `${this.relativeUrl}/${borrowerSlug}/`;

    return this.http.get<Borrower>(url)
      .pipe(
        tap(() => console.log('getBorrower()', Math.random()))
      )
  };

}
