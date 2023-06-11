import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, forkJoin, lastValueFrom, map, of, tap} from 'rxjs';
import {SharedService} from '../shared/shared.service';
import {
  FieldOption,
  LeaseStructure,
  Scheme,
  Unit,
  UnitStructure,
  UnitScheduleData
} from 'src/app/_interfaces/scheme.interface';
import {AssetClassType} from 'src/app/_types/custom.type';
import {toTitleCase} from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  parametersRequiredSub = new BehaviorSubject<string[]>([]);
  fileNameSub = new BehaviorSubject<string>('');
  fileSub = new BehaviorSubject<File>({} as File);

  getFileNameSub(): Observable<string> {
    return this.fileNameSub.asObservable();
  }
  setFileNameSub(fileName: string) {
    return this.fileNameSub.next(fileName);
  }

  getFileSub(): Observable<File> {
    return this.fileSub.asObservable();
  }
  setFileSub(file: File) {
    return this.fileSub.next(file);
  }

  getParametersRequiredSub(): Observable<string[]> {
    return this.parametersRequiredSub.asObservable();
  }
  setParametersRequiredSub(parametersRequired: string[]) {
    return this.parametersRequiredSub.next(parametersRequired);
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
      body: units
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
    return this.http.get<UnitScheduleData[]>(url).pipe(tap(() => console.log('getUnitsScheduleBTS()', Math.random())));
  }

  updateOrCreateUnitsScheduleBTR(unitsScheduleData: UnitScheduleData[]): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/units_and_leases/`;
    return this.http
      .post<UnitScheduleData[]>(url, unitsScheduleData)
      .pipe(tap(() => console.log('units_and_leases()', Math.random())));
  }

  getUnitsScheduleBTR(assetClass: AssetClassType): Observable<UnitScheduleData[]> {
    const url = `/api/asset_class/${assetClass.id}/units_and_leases/`;
    return this.http.get<UnitScheduleData[]>(url).pipe(tap(() => console.log('getUnitsScheduleBTR()', Math.random())));
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
    const areaSystem = scheme.system.toLowerCase() as 'sqft' | 'sqm';

    return {label, areaType, areaSystem, hasBeds};
  }

  createLeaseStructure(assetClass: AssetClassType): LeaseStructure {
    const rentFrequency = assetClass.use === 'studentAccommodation' ? 'perWeek' : 'perMonth';
    return {rentFrequency};
  }

  getUnitFieldsMap(assetClass: AssetClassType, scheme: Scheme): Record<string, string | null> {
    const workingUse = ['commercial', 'office', 'shoppingCentre', 'parking'];
    const labelIsRomm = ['hotel', 'studentAccommodation'];
    return {
      label: labelIsRomm.includes(assetClass.use) ? 'room' : 'unit',
      identifier: 'identifier',
      description: 'description',
      beds: assetClass.hasBeds ? 'beds' : null,
      areaSize: 'area',
      areaType: workingUse.includes(assetClass.use) ? 'GIA' : 'NIA',
      areaSystem: scheme.system.toLowerCase()
    };
  }

  getUnitControlNames(assetClass: AssetClassType, scheme: Scheme) {
    const unitFieldsMap = this.getUnitFieldsMap(assetClass, scheme);

    let result = Object.keys(unitFieldsMap).filter(key => {
      return key !== 'areaSystem' && key !== 'areaType' && key !== 'label' && unitFieldsMap[key] !== null;
    });

    return result;
  }

  displayUnitFields(assetClass: AssetClassType, scheme: Scheme): string[] {
    const unitFieldsMap = this.getUnitFieldsMap(assetClass, scheme);
    let result = [];
    result.push(
      toTitleCase(unitFieldsMap['identifier']!),
      toTitleCase(unitFieldsMap['description']!),
      unitFieldsMap['areaType'] + ' (' + unitFieldsMap['areaSystem']!.toLowerCase() + ')'
    );

    if (unitFieldsMap['beds']) {
      result.splice(2, 0, toTitleCase(unitFieldsMap['beds']));
    }

    return result;
  }

  getSaleFieldsMap(assetClass: AssetClassType): Record<string, string | null> {
    return {
      ownershipType: assetClass.use === 'residential' ? 'ownership type' : null,
      priceTarget: 'price target',
      priceAchieved: 'price achieved',
      status: 'status',
      statusDate: 'status date',
      buyer: 'buyer'
    };
  }

  getSaleControlNames(assetClass: AssetClassType): string[] {
    const saleFieldsMap = this.getSaleFieldsMap(assetClass);

    return Object.keys(saleFieldsMap).filter(key => {
      return saleFieldsMap[key] !== null;
    });
  }

  displaySaleFields(assetClass: AssetClassType) {
    const saleFieldsMap = this.getSaleFieldsMap(assetClass);
    const result = Object.values(saleFieldsMap).filter(item => item !== null) as string[];
    return result.map(s => toTitleCase(s));
  }

  displaySaleFieldsOptions(assetClass: AssetClassType): Observable<FieldOption[]>  {
    const saleFieldsMap = this.getSaleFieldsMap(assetClass);

    return forkJoin({
      ownershiptypeChoices: this._sharedService.getChoices('ownershipType'),
      statusChoices: this._sharedService.getChoices('saleStatus')
    }).pipe(
      map(({ownershiptypeChoices, statusChoices}) => {
        const ownershipOption: FieldOption = {
          name: saleFieldsMap['ownershipType']!,
          options: ownershiptypeChoices.map(choice => choice.label)
        };

        const statusOption: FieldOption = {
          name: saleFieldsMap['status']!,
          options: statusChoices.map(choice => choice.label)
        };

        return [ownershipOption, statusOption];
      })
    );
  }

  displayLeaseTypeOptions(assetClass: AssetClassType): Observable<FieldOption[]> {
    if (assetClass.use !== 'residential') {
      return of([]);
    }

    const leaseFieldsMap = this.getLeaseFieldsMap(assetClass);

    return this._sharedService.getChoices('leaseType').pipe(
      map(leaseTypeChoices => {
        const leaseTypeOption: FieldOption = {
          name: leaseFieldsMap['leaseType']!,
          options: leaseTypeChoices.map(choice => choice.label)
        };
  
        return [leaseTypeOption];
      })
    );
  }

  getLeaseFieldsMap(assetClass: AssetClassType): Record<string, string | null> {
    let rentFrequencyDisplay = '';
    if (assetClass.use === 'hotel') {
      rentFrequencyDisplay = 'per day';
    } else if (assetClass.use === 'studentAccommodation') {
      rentFrequencyDisplay = 'per week';
    } else {
      rentFrequencyDisplay = 'per month';
    }

    return {
      tenant: 'tenant',
      leaseType: assetClass.use === 'residential' ? 'lease type' : null,
      rentTarget: 'rent target',
      rentAchieved: 'rent achieved',
      rentFrequency: rentFrequencyDisplay,
      startDate: 'start date',
      endDate: 'end date'
    };
  }

  getLeaseControlNames(assetClass: AssetClassType) {
    const leaseFieldsMap = this.getLeaseFieldsMap(assetClass);

    let result = Object.keys(leaseFieldsMap).filter(key => {
      return key !== 'rentFrequency' && leaseFieldsMap[key] !== null;
    });

    return result;
  }

  displayLeaseFields(assetClass: AssetClassType) {
    const leaseFieldsMap = this.getLeaseFieldsMap(assetClass);

    let result = [
      toTitleCase(leaseFieldsMap['rentTarget']!) + ' (' + leaseFieldsMap['rentFrequency'] + ')',
      toTitleCase(leaseFieldsMap['rentAchieved']!) + ' (' + leaseFieldsMap['rentFrequency'] + ')',
      toTitleCase(leaseFieldsMap['startDate']!),
      toTitleCase(leaseFieldsMap['endDate']!),
      toTitleCase(leaseFieldsMap['tenant']!)
    ];

    if (leaseFieldsMap['leaseType']) {
      result.splice(0, 0, toTitleCase(leaseFieldsMap['leaseType']));
    }

    return result;
  }

  displayUnitScheduleFields(assetClass: AssetClassType, scheme: Scheme) {
    const unitFieldsDisplayed = this.displayUnitFields(assetClass, scheme);
    const saleFieldsDisplayed = this.displaySaleFields(assetClass);
    const leaseFieldsDisplayed = this.displayLeaseFields(assetClass);

    if (assetClass.investmentStrategy === 'buildToSell') {
      return [...unitFieldsDisplayed, ...saleFieldsDisplayed];
    } else {
      return [...unitFieldsDisplayed, ...leaseFieldsDisplayed];
    }
  }

  displayUnitScheduleFieldsOptions(assetClass: AssetClassType): Observable<FieldOption[]> {
    if (assetClass.investmentStrategy === 'buildToSell') {
      return this.displaySaleFieldsOptions(assetClass);
    } else {
      return this.displayLeaseTypeOptions(assetClass);
    }
  }
}
