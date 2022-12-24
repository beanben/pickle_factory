import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Loan } from 'src/app/pages/loan/loan';
import { environment } from 'src/environments/environment';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  appRoot = "loan";
  urlRoot = `${environment.API_BASE_URL}/${this.appRoot}`

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  createLoan(loan: Loan) {
    return new Promise<APIResult>((resolve, reject) => {
      const url = `${this.urlRoot}/`;

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
    const url = `${this.urlRoot}/${loan.id}/`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(url, loan, this.httpOptions).subscribe({
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
    const url = `${this.urlRoot}/`;

    return this.http.get<Loan[]>(url)
      .pipe(
        tap(() => console.log('getLoans()', Math.random()))
      )
  };

  deleteLoan(loan: Loan): Observable<any> {
    const url = `${this.urlRoot}/${loan.id}/`;

    const options = {
      headers: this.httpOptions["headers"],
      body: loan
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteLoan()', Math.random()))
    );
  }



}
