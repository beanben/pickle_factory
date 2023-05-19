<<<<<<< HEAD
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {SharedService} from '../shared/shared.service';
import {AssetClassUnits, Scheme, Unit} from 'src/app/_interfaces/scheme.interface';
import {APIResult} from 'src/app/_interfaces/api.interface';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {AssetClassType} from 'src/app/_types/custom.type';
=======
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { AssetClassData, Scheme, Unit } from 'src/app/_interfaces/scheme.interface';
import { APIResult } from 'src/app/_interfaces/api.interface';
import { Choice } from 'src/app/_interfaces/shared.interface';
import { AssetClassType } from 'src/app/_types/custom.type';
>>>>>>> behavior-assetClassId

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  relativeUrl = '/api/scheme';
<<<<<<< HEAD
  // schemeDataSub = new BehaviorSubject<SchemeData>({assetClassUnits: []} as SchemeData);
  schemeDataSub = new BehaviorSubject<AssetClassUnits[]>([] as AssetClassUnits[]);
=======
  // schemeDataSub = new BehaviorSubject<SchemeData>({} as SchemeData);
  assetClassDataSub = new BehaviorSubject<AssetClassData[]>([] as AssetClassData[]);
>>>>>>> behavior-assetClassId

  constructor(private http: HttpClient, private _sharedService: SharedService) {}

  getScheme(schemeId: number): Observable<Scheme> {
    const url = `${this.relativeUrl}/${schemeId}/`;
    return this.http.get<Scheme>(url).pipe(tap(() => console.log('getScheme()', Math.random())));
  }

<<<<<<< HEAD
  getSchemeDataSub(): Observable<AssetClassUnits[]> {
    return this.schemeDataSub.asObservable();
  }
  setSchemeDataSub(schemeData: AssetClassUnits[]) {
    return this.schemeDataSub.next(schemeData);
=======
  getAssetClassDataSub():Observable<AssetClassData[]>{
    return this.assetClassDataSub.asObservable() 
  }
  setAssetClassDataSub(assetClassData: AssetClassData){
    const currentData = this.assetClassDataSub.getValue();
    const updatedData = currentData.filter((data) => data.assetClass.use !== assetClassData.assetClass.use);
    const index = currentData.findIndex((data) => data.assetClass.use === assetClassData.assetClass.use);
    updatedData.push(assetClassData)
    return this.assetClassDataSub.next(updatedData);
>>>>>>> behavior-assetClassId
  }

  createScheme(scheme: Scheme) {
    const url = `${this.relativeUrl}/`;

    return new Promise<APIResult>((resolve, reject) => {
      this.http.post(url, scheme).subscribe({
        next: data => {
          const result = data as APIResult;
          if (result.status === 'success') {
            resolve(result);
          } else {
            reject(result.message);
          }
        },
        error: error => {
          reject(this._sharedService.handleError(error));
        }
      });
    });
  }

  updateScheme(scheme: Scheme) {
    const url = `${this.relativeUrl}/${scheme.id}/`;

    return new Promise<APIResult>((resolve, reject) => {
      this.http.put(url, scheme).subscribe({
        next: data => {
          const result = data as APIResult;

          if (result.status === 'success') {
            resolve(result);
          } else {
            reject(result.message);
          }
        },

        error: error => {
          reject(this._sharedService.handleError(error));
        }
      });
    });
  }

  deleteScheme(scheme: Scheme): Observable<any> {
    const url = `${this.relativeUrl}/${scheme.id}/`;

    const options = {
      body: scheme
    };

    return this.http.delete(url, options).pipe(tap(() => console.log('deleteScheme()', Math.random())));
  }

  getAssetClassUses(): Observable<string[]> {
    const url = `${this.relativeUrl}/asset_class_uses/`;
    return this.http.get<string[]>(url).pipe(tap(() => console.log('getAssetClassUses()', Math.random())));
  }

<<<<<<< HEAD
  getChoices(choiceType: string): Observable<Choice[]> {
    const url = `/api/choices/${choiceType}/`;
    return this.http.get<Choice[]>(url).pipe(tap(() => console.log('getChoices()', Math.random())));
  }
=======
>>>>>>> behavior-assetClassId

  createAssetClass(assetClass: AssetClassType) {
    const url = '/api/asset_class/';
    console.log('createAssetClass()');
    return new Promise<APIResult>((resolve, reject) => {
      this.http.post(url, assetClass).subscribe({
        next: data => {
          let result = data as APIResult;
          if (result.status === 'success') {
            resolve(result);
          } else {
            reject(result.message);
          }
        },
        error: error => {
          reject(this._sharedService.handleError(error));
        }
      });
    });
  }

  deleteAssetClass(assetClass: AssetClassType): Observable<any> {
    const url = `/api/asset_class/${assetClass.id}/`;

    const options = {
      body: assetClass
    };

    return this.http.delete(url, options).pipe(tap(() => console.log('deleteAssetClass()', Math.random())));
  }

  getAssetClass(assetclass: AssetClassType): Observable<AssetClassType> {
    const url = `/api/asset_class/${assetclass.id}/`;

    return this.http.get<AssetClassType>(url).pipe(tap(() => console.log('getAssetClass()', Math.random())));
  }

  updateAssetClass(assetClass: AssetClassType) {
    const url = `/api/asset_class/${assetClass.id}/`;
    console.log('updateAssetClass()');
    return new Promise<APIResult>((resolve, reject) => {
      this.http.put(url, assetClass).subscribe({
        next: data => {
          let result = data as APIResult;
          if (result.status === 'success') {
            resolve(result);
          } else {
            reject(result.message);
          }
        },
        error: error => {
          reject(this._sharedService.handleError(error));
        }
      });
    });
  }

  getSchemeAssetClasses(scheme: Scheme): Observable<AssetClassType[]> {
    const url = `/api/scheme/${scheme.id}/asset_classes/`;
    return this.http.get<AssetClassType[]>(url).pipe(tap(() => console.log('getSchemeAssetClasses()', Math.random())));
  }

  getAssetClassUnits(assetClass: AssetClassType): Observable<Unit[]> {
    const url = `/api/asset_class/${assetClass.id}/units/`;
    return this.http.get<Unit[]>(url).pipe(tap(() => console.log('getAssetClassUnits()', Math.random())));
  }

  // getAssetClassUnitsWithSaleAndLease(assetClass: AssetClassType): Observable<UnitScheduleData[]> {
  //   const url = `/api/asset_class/${assetClass.id}/units_with_sale_and_lease/`;
  //   return this.http
  //     .get<UnitScheduleData[]>(url)
  //     .pipe(tap(() => console.log('getAssetClassUnitsWithSaleAndLease()', Math.random())));
  // }

<<<<<<< HEAD
  getChoiceLabel(choice_value: string, choices: Choice[]): string {
    const choice = choices.find(choice => choice.value === choice_value);
    return choice ? choice.label : '';
  }

  getSchemeData(scheme: Scheme): Observable<AssetClassUnits[]> {
    const url = `/api/scheme/${scheme.id}/data/`;
    return this.http.get<AssetClassUnits[]>(url).pipe(tap(() => console.log('getSchemeData()', Math.random())));
  }
=======
  

  // getSchemeData(scheme: Scheme): Observable<SchemeData> {
  //   const url = `/api/scheme/${scheme.id}/data/`;
  //   return this.http.get<SchemeData>(url).pipe(tap(() => console.log('getSchemeData()', Math.random())));
  // }
>>>>>>> behavior-assetClassId
}
