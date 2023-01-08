import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Borrower } from 'src/app/pages/borrower/borrower';
import { Property } from 'src/app/pages/property/property';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  relativeUrl = "/api/borrower";

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  createProperty(borrower: Borrower, property: Property) {
    return new Promise<APIResult>((resolve, reject) => {
      const relativeUrl = `${this.relativeUrl}/${borrower.id}/building`;

      this.http.post(relativeUrl, property).subscribe({
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
