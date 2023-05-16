import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

import {SchemeService} from 'src/app/_services/scheme/scheme.service';
import {Subscription, lastValueFrom} from 'rxjs';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {AssetClassType} from 'src/app/_types/custom.type';
import {AssetClassUnits, Scheme, Unit} from 'src/app/_interfaces/scheme.interface';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit, OnDestroy {
  openAssetClassModal = false;
  modalMode = '';
  isShow = true;
  // assetClassUses: string[] = [];
  availableUseChoices: Choice[] = [];
  assetClassSelected = {} as AssetClassType;
  tabActive = '';
  // schemeAssetClassesUnits: AssetClassUnits[] = [];
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

  @Input() scheme = {} as Scheme;
  schemeAssetClasses: AssetClassType[] = [];
  subs: Subscription[] = [];
  useChoices: Choice[] = [];
  schemeData: AssetClassUnits[] = [];

  constructor(private _schemeService: SchemeService) {}

  // async ngOnInit(): Promise<void> {
  // this.onSelectAssetClass(0);
  // this.assetClassUses = await this.getAssetClassUses();
  // this.availableAssetClassUses = this.getAvailableAssetClassUses();
  // }

  async ngOnInit() {
    await this.getChoices('assetClass', this.useChoices);
    // await this.setSchemeDataSub();

    this.subs.push(
      this._schemeService.getSchemeDataSub()
      .subscribe((schemeData: AssetClassUnits[]) => {
        this.schemeData = schemeData;
        // console.log('schemeData:', schemeData);
        this.getAvailableAssetClassUses();
        this.onSelectAssetClass(0);
      })
    );
  }

  // setSchemeDataSub() {
  //   this.getSchemeData(this.scheme)
  //     .then(schemeData => {
  //       this._schemeService.setSchemeDataSub(schemeData);
  //     })
  //     .catch(error => {
  //       console.error('Error while fetching scheme data:', error);
  //     });
  // }

  // async getSchemeData(scheme: Scheme) {
  //   const schemeData: AssetClassUnits[] = [];

  //   try {
  //     const assetClasses$ = this._schemeService.getSchemeAssetClasses(scheme);
  //     const assetClasses: AssetClassType[] = await lastValueFrom(assetClasses$);

  //     for (let i = 0; i < assetClasses.length; i++) {
  //       const assetClass = assetClasses[i];
  //       const units$ = this._schemeService.getAssetClassUnits(assetClass);
  //       const units: Unit[] = await lastValueFrom(units$);
  //       const assetClassUnit = {assetClass, units} as AssetClassUnits;
  //       schemeData.push(assetClassUnit);
  //     }
  //   } catch (error) {
  //     console.error('Error while fetching asset classes and units:', error);
  //   }

  //   return schemeData;
  // }

  // async ngOnChanges(changes: SimpleChanges) {
  //   if (changes['scheme'] && changes['scheme'].currentValue) {
  //     const scheme: Scheme = changes['scheme'].currentValue;
  //     // this.getSchemeAssetClasses(scheme);

  //     // this._schemeService.getSchemeAssetClassesUnits(scheme);
  //     // this.getAvailableAssetClassUses();
  //     // this.onSelectAssetClass(0);
  //     await this.setSchemeDataSub();
  //   }
  // }

  async getChoices(choiceType: string, targetArray: Choice[]): Promise<void> {
    const choices$ = this._schemeService.getChoices(choiceType);
    const choices: Choice[] = await lastValueFrom(choices$);
    targetArray.push(...choices);
  }

  getUseLabel(use: string): string {
    const useChoice = this.useChoices.find(choice => choice.value === use);
    return useChoice ? useChoice.label : '';
  }

  // getSchemeAssetClasses(scheme: Scheme) {
  //   this._schemeService.getSchemeAssetClasses(scheme).subscribe((assetClasses: AssetClassType[]) => {
  //     this.schemeAssetClasses = assetClasses;

  //     this.getAvailableAssetClassUses();
  //     this.onSelectAssetClass(0);
  //     // this.getAssetClassesUnits(assetClasses)
  //   });
  // }

  onOpenAssetClassModal(modalMode: string) {
    this.openAssetClassModal = true;
    this.modalMode = modalMode;
  }

  // getAssetClassesUnits(assetClasses: AssetClassType[]) {
  //   assetClasses.forEach((assetClass: AssetClassType) => {
  //     this._schemeService.getAssetClassUnits(assetClass)
  //       .subscribe((units: Unit[]) => {

  //         this._schemeService
  //         const assetClassUnits = {
  //           assetClass: units
  //       };
  //   });
  // onOpenStrategyModal(modalMode: string) {
  //   this.openStrategyModal = true;
  //   this.modalMode = modalMode;
  // }

  // onOpenUnitScheduleModal(modalMode: string) {
  //   this.openUnitScheduleModal = true;
  //   this.modalMode = modalMode;
  // }

  onSaveAssetClass(assetClass: AssetClassType | null) {
    this.openAssetClassModal = false;

    if (!!assetClass) {
      this.getAvailableAssetClassUses();
      this.updateSchemeAssetClass(assetClass);
      // this.updateAvailableAssetClassUses(assetClass);
    }
  }

  // updateAvailableAssetClassUses(assetClass: AssetClassType) {
  //   let index = this.availableAssetClassUses.findIndex(assetClassUse => assetClassUse.toLowerCase() === assetClass.use);
  //   this.availableAssetClassUses.splice(index, 1);
  // }

  updateSchemeAssetClass(assetClass: AssetClassType) {
    let index = this.schemeAssetClasses.findIndex(schemeAssetClass => schemeAssetClass.id === assetClass.id);
    if (index !== -1) {
      this.schemeAssetClasses[index] = assetClass;
    } else {
      this.schemeAssetClasses.push(assetClass);
    }
  }

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

  getAvailableAssetClassUses() {
    // const existingAssetClassUses: string[] = this.schemeAssetClasses.map(assetClass => assetClass.use);
    const existingAssetClassUses: string[] = this.schemeData.map(assetClassUnits => assetClassUnits.assetClass.use);

    this.availableUseChoices = this.useChoices.filter(choice => !existingAssetClassUses.includes(choice.value));
    // this._schemeService.getChoices('assetClass').subscribe((choices: Choice[]) => {
    //   this.availableUseChoices = choices.filter(choice => !existingAssetClassUses.includes(choice.value));
    // });
  }

  onSelectAssetClass(index: number) {
    this.assetClassSelected = this.schemeAssetClasses[index];
    if (this.schemeAssetClasses.length > 0) {
      this.tabActive = this.assetClassSelected.use;
    }
  }

  // onUpdateInvestmentStrategy() {
  //   this.openStrategyModal = false;
  // }

  onDeleteAssetClass() {
    this.openAssetClassModal = false;
    let index = this.schemeAssetClasses.findIndex(assetClass => assetClass.id === this.assetClassSelected.id);
    this.schemeAssetClasses.splice(index, 1);
    this.getAvailableAssetClassUses();

    // this.availableAssetClassUses.push(this.assetClassSelected.use);
    this.onSelectAssetClass(0);
  }

  // onEditUnitSchedule(units:Unit[] | null) {
  //   this.openUnitScheduleModal = false;

  //   if(units){
  //     this.assetClassSelected.units = units;
  //   }
  // }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
