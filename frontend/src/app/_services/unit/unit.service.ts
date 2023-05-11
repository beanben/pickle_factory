import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { Unit, UnitScheduleData } from 'src/app/_interfaces/scheme.interface';
import { AssetClassType } from 'src/app/_types/custom.type';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient, private _sharedService: SharedService) {}

  createUnits(units: Unit[]): Observable<Unit[]> {
    const url = '/api/unit/';

    return this.http.post<Unit[]>(url, units).pipe(tap(() => console.log('createUnits()', Math.random())));
  }

  updateUnits(units: Unit[]): Observable<Unit[]> {
    const url = '/api/unit/bulk_update_delete/';

    return this.http.put<Unit[]>(url, units).pipe(tap(() => console.log('updateUnits()', Math.random())));
  }

  updateOrCreateUnits(units: Unit[]): Observable<Unit[]> {
    const url = '/api/unit/bulk_update_create/';

    return this.http.post<Unit[]>(url, units).pipe(tap(() => console.log('updateOrCreateUnits()', Math.random())));
  }

  deleteUnits(units: Unit[]): Observable<any> {
    const url = '/api/unit/bulk_update_delete/';
    const httpOptions = {
      body: units,
    };

    return this.http.delete(url, httpOptions).pipe(tap(() => console.log('deleteUnits()', Math.random())));
  }

  updateOrCreateUnitsScheduleData(unitsScheduleData: UnitScheduleData[]): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/unit_schedule_data_bulk_update_create/`;
    return this.http
      .post<UnitScheduleData[]>(url, unitsScheduleData)
      .pipe(tap(() => console.log('updateOrCreateUnitsScheduleData()', Math.random())));
  }


  // MAYBE MAKE THIS A PROPERTY OF MODELS
  defineLeaseRentFrequency(assetClass: AssetClassType){
    const isWeekly = ['studentAccommodation'];
    return isWeekly.includes(assetClass.use) ? 'perWeek' : 'perMonth';
  }


}
