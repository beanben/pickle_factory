import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Scheme } from 'src/app/pages/loans/loan/scheme/scheme';
import { AssetClassType,  Unit } from 'src/app/pages/loans/loan/scheme/scheme.model';
import { Choice } from 'src/app/shared/shared';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  relativeUrl = "/api/scheme";
  availableAssetClassUsesSub = new BehaviorSubject<string[]>([]);

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  setAvailableAssetClassUsesSub(availableAssetClassUse: string[]){
    return this.availableAssetClassUsesSub.next(availableAssetClassUse);
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

  getAssetClassUses(): Observable<string[]>  {
    const url = `${this.relativeUrl}/asset_class_uses/`;
    return this.http.get<string[]>(url).pipe(
      tap(() => console.log('getAssetClassUses()', Math.random())),
    );
  }
  
  getSystemTypes(): Observable<Choice[]> {
    const url = `${this.relativeUrl}/system_types/`;
    return this.http.get<Choice[]>(url).pipe(
      tap(() => console.log('getSystemTypes()', Math.random())),
    );
  }

  createAssetClass(assetClass: AssetClassType) {
    const url = "/api/asset_class/";

    return new Promise<APIResult>((resolve, reject) => {
     
      this.http.post(url, assetClass).subscribe({
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

  deleteAssetClass(assetClass: AssetClassType): Observable<any> {
    const url = `/api/asset_class/${assetClass.id}/`;

    const options = {
      body: assetClass
    }

    return this.http.delete(url, options).pipe(
      tap(() => console.log('deleteAssetClass()', Math.random()))
    ); 
  }

  getAssetClass(assetclass: AssetClassType): Observable<AssetClassType> {
    const url = `/api/asset_class/${assetclass.id}/`;
    
    return this.http.get<AssetClassType>(url)
      .pipe(
        tap(() => console.log('getAssetClass()', Math.random()))
      )
  };

  // getAvailableAssetClasses(scheme: Scheme): Observable<string[]>  {
  //   const url = `${this.relativeUrl}/${scheme.id}/available_asset_classes/`;
  //   return this.http.get<string[]>(url).pipe(
  //     tap(() => console.log('getAvailableAssetClasses()', Math.random())),
  //   );
  // }

}
