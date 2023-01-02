import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Borrower } from 'src/app/pages/borrower/borrower';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {
  relativeUrl = "/api/loan/borrower";
  borrowerSub = new BehaviorSubject<Borrower>({} as Borrower);
  borrowerTabSub = new BehaviorSubject<boolean>(false);

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

  getBorrowerTabSub():Observable<boolean>{
    return this.borrowerTabSub.asObservable() 
  }
  setBorrowerTabSub(isCollapsed: boolean){
    return this.borrowerTabSub.next(isCollapsed);
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
    const url = `${this.relativeUrl}/${borrower.id}/`;

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
    const url = `${this.relativeUrl}/${borrower.id}/`;

    const options = {
      body: borrower
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteBorrower()', Math.random()))
    );
  }

}
