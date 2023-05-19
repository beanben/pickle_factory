import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { APIResult } from 'src/app/_interfaces/api.interface';
import { Borrower } from 'src/app/_interfaces/loan.interface';

@Injectable({
  providedIn: 'root'
})
export class BorrowerService {
  relativeUrl = "/api/borrower";
  borrowerSub = new BehaviorSubject<Borrower>({} as Borrower);
  borrowersSub = new BehaviorSubject<Borrower[]>([] as Borrower[]);

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

  getBorrowersSub():Observable<Borrower[]>{
    return this.borrowersSub.asObservable() 
  }
  setBorrowersSub(borrowers: Borrower[]){
    return this.borrowersSub.next(borrowers);
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

  getBorrowers(): Observable<Borrower[]> {
    const url = `${this.relativeUrl}/`;

    return this.http.get<Borrower[]>(url)
      .pipe(
        tap(() => console.log('getBorrowers()', Math.random()))
      )
  };

}
