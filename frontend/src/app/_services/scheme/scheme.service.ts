import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map as rxjsMap, tap } from 'rxjs';
import { AssetClassType, AssetClassUnit, Scheme, SchemeData, UnitScheduleData } from 'src/app/pages/loans/loan/scheme/scheme';
import { Lease, Sale, Unit } from 'src/app/pages/loans/loan/scheme/scheme.model';
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
  // schemeDataSub = new BehaviorSubject<SchemeData>({} as SchemeData);

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

  // async getSchemeData(scheme: Scheme): Promise<void> {
  //   const assetClassUnits: AssetClassUnits[] = [];
  //   const assetClasses = await lastValueFrom(this.getSchemeAssetClasses(scheme));

  //   for (const assetClass of schemeAssetClasses) {
  //     const units = await lastValueFrom(this.getAssetClassUnits(assetClass));
  //     schemeAssetClassUnits.push({
  //       assetClass: assetClass,
  //       units: units,
  //     });
  //   }

  //   this.setSchemeAssetClassesUnitsSub(assetClassUnits);
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
      tap(() => console.log('getChoices()', Math.random())),
      // rxjsMap(this.convertChoiceValueToCamelCase)
    );
  }

  // convertChoiceValueToCamelCase(choices: Choice[]): Choice[] {
  //   return choices.map(choice => ({
  //     value: snakeToCamelCase(choice.value),
  //     label: choice.label,
  //   }));
  // }

  createAssetClass(assetClass: AssetClassType) {
    const url = "/api/asset_class/";
    console.log("createAssetClass()")
    return new Promise<APIResult>((resolve, reject) => {

      this.http.post(url, assetClass).subscribe({
        next: (data) => {
          let result = data as APIResult;
          if (result.status === "success") {
            // const assetClassRes = result.response as AssetClassType;
            // assetClassRes.investmentStrategy = snakeToCamelCase(assetClass.investmentStrategy)
            // result = {  ...result, response: assetClassRes }
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
    console.log("updateAssetClass()")
    return new Promise<APIResult>((resolve, reject) => {

      this.http.put(url, assetClass).subscribe({
        next: (data) => {
          let result = data as APIResult;
          if (result.status === "success") {
            // const assetClassRes = result.response as AssetClassType;
            // assetClassRes.investmentStrategy = snakeToCamelCase(assetClass.investmentStrategy)
            // result = {  ...result, response: assetClassRes }
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
        // rxjsMap(this.convertInvestmentStrategyToCamelCase)
      );
  }

  // convertInvestmentStrategyToCamelCase(assetClasses: AssetClassType[]): AssetClassType[] {
  //   return assetClasses.map(assetClass => ({
  //     ...assetClass,
  //     investmentStrategy: snakeToCamelCase(assetClass.investmentStrategy),
  //   }));
  // }

  getAssetClassUnits(assetClass: AssetClassType): Observable<Unit[]> {
    const url = `/api/asset_class/${assetClass.id}/units/`;
    return this.http.get<Unit[]>(url)
      .pipe(
        tap(() => console.log('getAssetClassUnits()', Math.random()))
      )
  };

  getAssetClassUnitsWithSaleAndLease(assetClass: AssetClassType): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/${assetClass.id}/units_with_sale_and_lease/`;
    return this.http.get<UnitScheduleData[]>(url).pipe(
      tap(() => console.log('getAssetClassUnitsWithSaleAndLease()', Math.random()))
    )
  }

  updateOrCreateUnitsScheduleData(unitsScheduleData: UnitScheduleData[]): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/unit_schedule_data_bulk_update_create/`;
    return this.http.post<UnitScheduleData[]>(url, unitsScheduleData).pipe(
      tap(() => console.log('updateOrCreateUnitsScheduleData()', Math.random()))
    );
  }

  getChoiceLabel(choice_value: string, choices: Choice[]): string {
    const choice = choices.find(choice => choice.value === choice_value);
    return choice ? choice.label : "";
  }

}
