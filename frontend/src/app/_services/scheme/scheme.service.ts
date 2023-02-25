import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Scheme, Unit } from 'src/app/pages/loans/loan/scheme/scheme';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  relativeUrl = "/api/scheme";
  assetClassChoicesSub = new BehaviorSubject<string[]>([]);

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  setAssetClassChoicesSub(AssetClassChoices: string[]){
    return this.assetClassChoicesSub.next(AssetClassChoices);
  }

  createScheme(scheme: Scheme) {
    const url = `${this.relativeUrl}/`;

    return new Promise<APIResult>((resolve, reject) => {
     
      this.http.post(url, scheme).subscribe({
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
    const url = `${this.relativeUrl}/${scheme.id}/`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(url, scheme).subscribe({
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

  deleteScheme(scheme: Scheme): Observable<any> {
    const url = `${this.relativeUrl}/${scheme.id}/`;

    const options = {
      body: scheme
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteScheme()', Math.random()))
    ); 
  }

  // createAssetClass(assetClass: AssetClass) {
  //   const schemeId = assetClass.schemeId;
  //   const url = `${this.relativeUrl}/${schemeId}/asset-class/`;

  //   return new Promise<APIResult>((resolve, reject) => {
     
  //     this.http.post(url, assetClass).subscribe({
  //       next: (data) => {
  //         const result = data as APIResult;
  //         if (result.status === "success"){
  //           resolve(result);
  //         } else {
  //           reject(result.message)
  //         }
  //       },
  //       error: (error) => {
  //         reject(this._sharedService.handleError(error));
  //       }
  //     })
  //   })
  // };

  createUnits(units: Unit[]) {
    const url = '/api/unit/';

    // return new Promise<APIResult>((resolve, reject) => {
     
    //   this.http.post(url, units).subscribe({
    //     next: (data) => {
    //       const result = data as APIResult;
    //       if (result.status === "success"){
    //         resolve(result);
    //       } else {
    //         reject(result.message)
    //       }
    //     },
    //     error: (error) => {
    //       reject(this._sharedService.handleError(error));
    //     }
    //   })
    // })
  };

  getAssetClassChoices(): Observable<string[]>  {
    const url = `${this.relativeUrl}/asset_class_choices/`;
    return this.http.get<string[]>(url).pipe(
      tap(() => console.log('getAssetClassChoices()', Math.random())),
    );
  }

  getAreaTypeChoices() {
    const url = `${this.relativeUrl}/area_type_choices/`;
    return this.http.get(url).pipe(
      tap(() => console.log('getAreaTypeChoices()', Math.random())),
    );
  }
}
