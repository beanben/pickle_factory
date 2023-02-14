import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Scheme, Unit, AssetClassMap } from 'src/app/pages/loans/loan/scheme/scheme';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  relativeUrl = "/api/scheme";
  assetClassMapSub = new BehaviorSubject<AssetClassMap>({} as AssetClassMap);

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  setAssetClassMapSub(AssetClassMap: AssetClassMap){
    return this.assetClassMapSub.next(AssetClassMap);
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

    return new Promise<APIResult>((resolve, reject) => {
     
      this.http.post(url, units).subscribe({
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

  getAssetClassMap(): Observable<AssetClassMap> {
    const url = '/api/unit/asset-class-map/';
    return this.http.get<AssetClassMap>(url).pipe(
      tap(() => console.log('getAssetClassMap()', Math.random())),
    );
  }


}
