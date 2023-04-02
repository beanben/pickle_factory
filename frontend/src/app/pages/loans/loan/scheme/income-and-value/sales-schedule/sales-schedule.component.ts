import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';

@Component({
  selector: 'app-sales-schedule',
  templateUrl: './sales-schedule.component.html',
  styleUrls: ['./sales-schedule.component.css']
})
export class SalesScheduleComponent implements OnInit, OnDestroy {
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;

  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit;
  subs: Subscription[] = []

  constructor(
    private _schemeService: SchemeService,
  ) { }

  ngOnInit(): void {
    this.unitStructure = new Unit(this.assetClass);
    // this.calculateUnitTotals();
    this.getScheme();
  }

  getScheme(){
    this.scheme = this._schemeService.schemeSub.getValue();

    this.subs.push(
      this._schemeService.getSchemeSub().subscribe(scheme => {
        this.scheme = scheme;
        this.updateAssetClass();
      })
    )

  }

  updateAssetClass(){
    this.assetClass = this.scheme.assetClasses.find(ac => ac.id === this.assetClass.id)!;
    this.calculateUnitTotals();
  }

  calculateUnitTotals(){
    this.totalUnits = this.assetClass.units?.length ?? 0;
    
    const totalAreaSizeCalc = this.assetClass.units?.reduce((acc, units) => acc + (+(units.areaSize ?? 0)), 0)
    this.totalAreaSize = +(totalAreaSizeCalc ?? 0).toFixed(2);

    const totalBedsCalc = this.assetClass.units?.reduce((acc, units) => acc + (units.beds ?? 0), 0);
    this.totalBeds = totalBedsCalc ?? 0;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
