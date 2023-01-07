import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Loan } from 'src/app/pages/loan/loan';
import { environment } from 'src/environments/environment';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  relativeUrl = "/api/loan";
  loanSub = new BehaviorSubject<Loan>({} as Loan);
  loanTabSub = new BehaviorSubject<boolean>(false);
  loanTabActiveSub = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  getLoanSub():Observable<Loan>{
    return this.loanSub.asObservable() 
  }
  setLoanSub(newLoan: Loan){
    return this.loanSub.next(newLoan);
  }

  getLoanTabSub():Observable<boolean>{
    return this.loanTabSub.asObservable() 
  }
  setLoanTabSub(isCollapsed: boolean){
    return this.loanTabSub.next(isCollapsed);
  }
  getLoanTabActiveSub():Observable<string>{
    return this.loanTabActiveSub.asObservable() 
  }
  setLoanTabActiveSub(tabActive: string){
    return this.loanTabActiveSub.next(tabActive);
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

  getLoan(loan: Loan): Observable<Loan> {
    const url = `${this.relativeUrl}/${loan.id}/`;

    return this.http.get<Loan>(url)
      .pipe(
        tap(() => console.log('getLoan()', Math.random()))
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
