import { Component, Input, OnInit } from '@angular/core';
import { Scheme } from '../scheme';
import { AssetClassType, Unit } from '../scheme.model';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { lastValueFrom } from 'rxjs';
import { addSpaceBetweenCapitalLetters } from 'src/app/shared/utils';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  // openAssetClassModal = false;
  // modalMode = "";
  // isShow = true;
  // assetClassUses: string[] = [];
  // availableAssetClassUses: string[] = [];
  // assetClassSelected = {} as AssetClassType;
  // tabActive = "";
  // openStrategyModal = false;
  // expandSalesSchedule = true;
  // expandSalesVelocity = false;
  // expandTenancySchedule = false;
  // expandLettingAssumptions = false;
  // investmentStrategyValueDisplay: { [key: string]: string } = {
  //   "buildToRent": "build to rent",
  //   "buildToSell": "build to sell",
  // }
  // openUnitScheduleModal = false;

  // @Input() scheme = {} as Scheme;

  // constructor(
  //   private _schemeService: SchemeService
  // ) { }

  async ngOnInit(): Promise<void> {
    // this.onSelectAssetClass(0);
    // this.assetClassUses = await this.getAssetClassUses();
    // this.availableAssetClassUses = this.getAvailableAssetClassUses();
    
  }

  // onOpenAssetClassModal(modalMode: string) {
  //   this.openAssetClassModal = true;
  //   this.modalMode = modalMode;
  // }

  // onOpenStrategyModal(modalMode: string) {
  //   this.openStrategyModal = true;
  //   this.modalMode = modalMode;
  // }

  // onOpenUnitScheduleModal(modalMode: string) {
  //   this.openUnitScheduleModal = true;
  //   this.modalMode = modalMode;
  // }

  // onSave(assetClass: AssetClassType | null) {
  //   this.openAssetClassModal = false;

  //   if (!!assetClass) {
  //     this.updateSchemeAssetClass(assetClass);
  //     this.updateAvailableAssetClassUses(assetClass);
  //   }
  // }

  // updateAvailableAssetClassUses(assetClass: AssetClassType) {
  //   let index = this.availableAssetClassUses.findIndex(assetClassUse => assetClassUse.toLowerCase() === assetClass.use);
  //   this.availableAssetClassUses.splice(index, 1);
  // }

  // updateSchemeAssetClass(assetClass: AssetClassType) {
  //   let index = this.scheme.assetClasses.findIndex(assetClass => assetClass.id === this.assetClassSelected.id);
  //   if(index !== -1){
  //     this.scheme.assetClasses[index] = assetClass;
  //   } else {
  //     this.scheme.assetClasses.push(assetClass);
  //   }
  // }

  // async getAssetClassUses(): Promise<string[]> {
  //   let assetClassUsesFormatted: string[] = [];
  //   const assetClassUsesSub: string[] = this._schemeService.assetClassUsesSub.getValue();

  //   if (assetClassUsesSub.length > 0) {
  //     return assetClassUsesSub
  //   }

  //   const assetClassUses: string[] = await lastValueFrom(this._schemeService.getAssetClassUses());
  //   assetClassUsesFormatted = assetClassUses.map(assetClassName => addSpaceBetweenCapitalLetters(assetClassName));
  //   this._schemeService.setAssetClassUsesSub(assetClassUsesFormatted);
  //   return assetClassUsesFormatted;
  // }

  // getAvailableAssetClassUses(): string[] {
  //   const existingAssetClassUses: string[] = this.scheme.assetClasses.map(assetClass => assetClass.use);

  //   return this.assetClassUses.filter(
  //     assetClassUse => !existingAssetClassUses.includes(assetClassUse.toLowerCase())
  //   );
  // }

  // onSelectAssetClass(index: number) {
  //   this.assetClassSelected = this.scheme.assetClasses[index];
  //   this.tabActive = this.assetClassSelected.use.toLowerCase();
  // }

  // onUpdateInvestmentStrategy() {
  //   this.openStrategyModal = false;
  // }

  // onDeleteAssetClass() {
  //   this.openAssetClassModal = false;
  //   let index = this.scheme.assetClasses.findIndex(assetClass => assetClass.id === this.assetClassSelected.id);
  //   this.scheme.assetClasses.splice(index, 1);
  //   this.availableAssetClassUses.push(this.assetClassSelected.use);
  //   this.onSelectAssetClass(0);
  // }

  // onEditUnitSchedule(units:Unit[] | null) {
  //   this.openUnitScheduleModal = false;

  //   if(units){
  //     this.assetClassSelected.units = units;
  //   }
  // }


}
