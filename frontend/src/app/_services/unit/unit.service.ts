import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { FieldOption, LeaseStructure, Scheme, Unit, UnitStructure, UnitScheduleData } from 'src/app/_interfaces/scheme.interface';
import { AssetClassType } from 'src/app/_types/custom.type';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  parametersOptionsDisplayed: FieldOption[] = [];
  parametresDisplayed: string[] = [];

  parametersRequiredSub = new BehaviorSubject<string[]>([]);
  fileNameSub = new BehaviorSubject<string>('');

  getFileNameSub():Observable<string>{
    return this.fileNameSub.asObservable() 
  }
  setFileNameSub(fileName:string){
    return this.fileNameSub.next(fileName) 
  }

  getParametersRequiredSub():Observable<string[]>{
    return this.parametersRequiredSub.asObservable()
  }
  setParametersRequiredSub(parametersRequired:string[]){
    return this.parametersRequiredSub.next(parametersRequired)
  }



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


  updateOrCreateUnitsScheduleBTS(unitsScheduleData: UnitScheduleData[]): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/units_and_sales/`;
    return this.http
      .post<UnitScheduleData[]>(url, unitsScheduleData)
      .pipe(tap(() => console.log('updateOrCreateUnitsScheduleBTS()', Math.random())));
  }

  getUnitsScheduleBTS(assetClass: AssetClassType): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/${assetClass.id}/units_and_sales/`;
    return this.http
      .get<UnitScheduleData[]>(url)
      .pipe(tap(() => console.log('getUnitsScheduleBTS()', Math.random())));
  }

  updateOrCreateUnitsScheduleBTR(unitsScheduleData: UnitScheduleData[]): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/units_and_leases/`;
    return this.http
      .post<UnitScheduleData[]>(url, unitsScheduleData)
      .pipe(tap(() => console.log('units_and_leases()', Math.random())));
  }

  getUnitsScheduleBTR(assetClass: AssetClassType): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/${assetClass.id}/units_and_leases/`;
    return this.http
      .get<UnitScheduleData[]>(url)
      .pipe(tap(() => console.log('getUnitsScheduleBTR()', Math.random())));
  }

  createUnitStructure(assetClass: AssetClassType, scheme: Scheme): UnitStructure {
    const hasRooms = ['hotel', 'studentAccommodation'];
    const hasUnits = ['commercial', 'office', 'shoppingCentre', 'residential'];
    const isNIA = ['hotel', 'studentAccommodation', 'residential'];
    const isGIA = ['commercial', 'office', 'shoppingCentre'];
    const useHasBeds = ['studentAccommodation', 'hotel', 'residential'];
    
    const label = hasRooms.includes(assetClass.use) ? 'room' : 'unit';
    const areaType = isNIA.includes(assetClass.use) ? 'NIA' : 'GIA';
    const hasBeds = useHasBeds.includes(assetClass.use);
    const areaSystem = scheme.system.toLowerCase() as 'sqft' | 'sqm' 

    return {label , areaType, areaSystem, hasBeds};
  }

  createLeaseStructure(assetClass: AssetClassType): LeaseStructure {
    const rentFrequency = assetClass.use === 'studentAccommodation' ? 'perWeek' : 'perMonth';
    return {rentFrequency};
  }



}
