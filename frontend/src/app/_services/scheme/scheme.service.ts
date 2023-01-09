import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Borrower } from 'src/app/pages/borrower/borrower';
import { Loan } from 'src/app/pages/loan/loan';
import { Scheme } from 'src/app/pages/scheme/scheme';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  relativeUrl = "/api/loan";

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  createScheme(scheme: Scheme) {
    const relativeUrl = `${this.relativeUrl}/${scheme.loan_id}/scheme`;

    return new Promise<APIResult>((resolve, reject) => {
     
      this.http.post(relativeUrl, scheme).subscribe({
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

  updateScheme(scheme: Scheme) {
    const relativeUrl = `${this.relativeUrl}/${scheme.loan_id}/scheme`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(relativeUrl, scheme).subscribe({
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


}
