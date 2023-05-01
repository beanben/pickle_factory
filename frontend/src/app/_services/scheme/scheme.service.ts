import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map as rxjsMap, tap } from 'rxjs';
import { AssetClassUnits, Scheme } from 'src/app/pages/loans/loan/scheme/scheme';
import { AssetClassType, Unit } from 'src/app/pages/loans/loan/scheme/scheme.model';
import { Choice } from 'src/app/shared/shared';
import { APIResult } from '../api-result';
import { SharedService } from '../shared/shared.service';
import { snakeToCamelCase } from 'src/app/shared/utils';



@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  relativeUrl = "/api/scheme";
  // availableAssetClassUsesSub = new BehaviorSubject<string[]>([]);
  // assetClassUsesSub = new BehaviorSubject<string[]>([]);
  // schemeSub = new BehaviorSubject<Scheme>({} as Scheme);
  // assetClassesUnitsSub = new BehaviorSubject<AssetClassUnits[]>([]);

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService
  ) { }

  // getAssetClassesUnitsSub():Observable<AssetClassUnits[]>{
  //   return this.assetClassesUnitsSub.asObservable()
  // }
  // setAssetClassesUnitsSub(assetClassesUnitsSub: AssetClassUnits[]){
  //   return this.assetClassesUnitsSub.next(assetClassesUnitsSub);
  // }

  // async getSchemeAssetClassesUnits(scheme: Scheme): Promise<void> {
  //   const assetClassUnits: AssetClassUnits[] = [];
  //   const assetClasses = await lastValueFrom(this.getSchemeAssetClasses(scheme));

  //   for (const assetClass of assetClasses) {
  //     const units = await lastValueFrom(this.getAssetClassUnits(assetClass));
  //     assetClassUnits.push({
  //       assetClass: assetClass,
  //       units: units,
  //     });
  //   }

  //   this.setAssetClassesUnitsSub(assetClassUnits);
  // }

  // setAvailableAssetClassUsesSub(availableAssetClassUse: string[]){
  //   return this.availableAssetClassUsesSub.next(availableAssetClassUse);
  // }
  // getAvailableAssetClassUsesSub():Observable<string[]>{
  //   return this.availableAssetClassUsesSub.asObservable()
  // }
  // setAssetClassUsesSub(assetClassUsesSub: string[]){
  //   return this.assetClassUsesSub.next(assetClassUsesSub);
  // }

  // setSchemeSub(scheme: Scheme){
  //   return this.schemeSub.next(scheme);
  // }
  // getSchemeSub():Observable<Scheme>{
  //   return this.schemeSub.asObservable()
  // }

  getScheme(schemeId: number): Observable<Scheme> {
    const url = `${this.relativeUrl}/${schemeId}/`;

    return this.http.get<Scheme>(url)
      .pipe(
        tap(() => console.log('getScheme()', Math.random()))
      )
  };

  createScheme(scheme: Scheme) {
    const url = `${this.relativeUrl}/`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.post(url, scheme).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success") {
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

          if (result.status === "success") {
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

  createUnits(units: Unit[]): Observable<Unit[]> {
    const url = '/api/unit/';

    return this.http.post<Unit[]>(url, units).pipe(
      tap(() => console.log('createUnits()', Math.random()))
    );
  }

  updateUnits(units: Unit[]): Observable<Unit[]> {
    const url = '/api/unit/bulk_update_delete/';

    return this.http.put<Unit[]>(url, units).pipe(
      tap(() => console.log('updateUnits()', Math.random()))
    );
  }

  updateOrCreateUnits(units: Unit[]): Observable<Unit[]> {
    const url = '/api/unit/bulk_update_create/';

    return this.http.post<Unit[]>(url, units).pipe(
      tap(() => console.log('updateOrCreateUnits()', Math.random()))
    );
  }

  deleteUnits(units: Unit[]): Observable<any> {
    const url = '/api/unit/bulk_update_delete/';
    const httpOptions = {
      body: units
    };

    return this.http.delete(url, httpOptions).pipe(
      tap(() => console.log('deleteUnits()', Math.random()))
    );
  }

  getAssetClassUses(): Observable<string[]> {
    const url = `${this.relativeUrl}/asset_class_uses/`;
    return this.http.get<string[]>(url).pipe(
      tap(() => console.log('getAssetClassUses()', Math.random())),
    );
  }

  getChoices(choiceType: string): Observable<Choice[]> {
    const url = `/api/choices/${choiceType}/`;
    return this.http.get<Choice[]>(url).pipe(
      tap(() => console.log('getChoices()', Math.random()))
    );
  }

  createAssetClass(assetClass: AssetClassType) {
    const url = "/api/asset_class/";

    return new Promise<APIResult>((resolve, reject) => {

      this.http.post(url, assetClass).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success") {
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

  updateAssetClass(assetClass: AssetClassType) {
    const url = `/api/asset_class/${assetClass.id}/`;

    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(url, assetClass).subscribe({
        next: (data) => {
          const result = data as APIResult;
          if (result.status === "success") {
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

  getSchemeAssetClasses(scheme: Scheme): Observable<AssetClassType[]> {
    const url = `/api/scheme/${scheme.id}/asset_classes/`;
    return this.http.get<AssetClassType[]>(url)
      .pipe(
        tap(() => console.log('getSchemeAssetClasses()', Math.random())),
        rxjsMap((assetClasses: AssetClassType[]) => {
          return assetClasses.map(assetClass => {
            return {
              ...assetClass,
              investmentStrategy: snakeToCamelCase(assetClass.investmentStrategy),
            };
          });
        }),
      );
  }

  getAssetClassUnits(assetClass: AssetClassType): Observable<Unit[]> {
    const url = `/api/asset_class/${assetClass.id}/units/`;
    return this.http.get<Unit[]>(url)
      .pipe(
        tap(() => console.log('getAssetClassUnits()', Math.random()))
      )
  };

  // getSaleStatusChoices(): Observable<Choice[]> {
  //   const url = "/api/unit/sale_status_choices/";
  //   return this.http.get<Choice[]>(url).pipe(
  //     tap(() => console.log('getSaleStatusChoices()', Math.random()))
  //   )
  // }

  // // DOESNT Exist
  // getUnitsPerAssetClass(assetClass: AssetClassType): Observable<Unit[]> {
  //   const url = `/api/unit/${assetClass.id}/`;
  //   return this.http.get<Unit[]>(url).pipe(
  //     tap(() => console.log('getUnitsPerAssetClass()', Math.random()))
  //   )
  // }

}
