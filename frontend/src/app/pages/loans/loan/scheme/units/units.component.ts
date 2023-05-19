import {Component, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

import {SchemeService} from 'src/app/_services/scheme/scheme.service';
import {Subscription, lastValueFrom} from 'rxjs';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {AssetClassType} from 'src/app/_types/custom.type';
import {Scheme, Unit} from 'src/app/_interfaces/scheme.interface';
import { SharedService } from 'src/app/_services/shared/shared.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit, OnDestroy {
  openAssetClassModal = false;
  modalMode = '';
  isShow = true;
  availableUseChoices: Choice[] = [];
  assetClassSelected = {} as AssetClassType;
  tabActive = '';

  @Input() scheme = {} as Scheme;
  schemeAssetClasses: AssetClassType[] = [];
  subs: Subscription[] = [];
  useChoices: Choice[] = [];

  constructor(
    private _schemeService: SchemeService,
    private _sharedService: SharedService
    ) {}

  async ngOnInit() {
    await this.getChoices('assetClass', this.useChoices);
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['scheme'] && changes['scheme'].currentValue) {
      const scheme: Scheme = changes['scheme'].currentValue;
      this.getSchemeAssetClasses(scheme).then(() => {
        this.getAvailableAssetClassUses();
        this.onSelectAssetClass(0);
      });

    }
  }

  onOpenAssetClassModal(modalMode: string) {
    this.openAssetClassModal = true;
    this.modalMode = modalMode;
  }

  async getChoices(choiceType: string, targetArray: Choice[]): Promise<void> {
    const choices$ = this._sharedService.getChoices(choiceType);
    const choices: Choice[] = await lastValueFrom(choices$);
    targetArray.push(...choices);
  }

  getUseLabel(use: string): string {
    return this._sharedService.getChoiceLabel(use, this.useChoices);
  }

  async getSchemeAssetClasses(scheme: Scheme) {
    const assetClasses$ = this._schemeService.getSchemeAssetClasses(scheme);
    const assetClasses: AssetClassType[] = await lastValueFrom(assetClasses$);
    this.schemeAssetClasses = assetClasses;

    await this.fetchAssetClassData(assetClasses);
  }

  async fetchAssetClassData(assetClasses: AssetClassType[]) {
    for (let assetClass of assetClasses) {
      await this.fetchAssetClassUnits(assetClass);
    }
  }

  async fetchAssetClassUnits(assetClass: AssetClassType) {
    const units$ = this._schemeService.getAssetClassUnits(assetClass);
    const units: Unit[] = await lastValueFrom(units$);
    this.storeAssetClassData(assetClass, units);
  }


  storeAssetClassData(assetClass: AssetClassType, units: Unit[]) {
    const assetClassData = {assetClass, units};
    this._schemeService.setAssetClassDataSub(assetClassData);
  }


  onSaveAssetClass(assetClass: AssetClassType | null) {
    this.openAssetClassModal = false;

    if (!!assetClass) {
      this.getAvailableAssetClassUses();
      this.updateSchemeAssetClass(assetClass);
    }
  }


  updateSchemeAssetClass(assetClass: AssetClassType) {
    let index = this.schemeAssetClasses.findIndex(schemeAssetClass => schemeAssetClass.id === assetClass.id);
    if (index !== -1) {
      this.schemeAssetClasses[index] = assetClass;
    } else {
      this.schemeAssetClasses.push(assetClass);
    }
  }


  getAvailableAssetClassUses() {
    const existingAssetClassUses: string[] = this.schemeAssetClasses.map(assetClass => assetClass.use);

    this._sharedService.getChoices('assetClass').subscribe((choices: Choice[]) => {
      this.availableUseChoices = choices.filter(choice => !existingAssetClassUses.includes(choice.value));
    });
  }

  onSelectAssetClass(index: number) {
    this.assetClassSelected = this.schemeAssetClasses[index];
    if (this.schemeAssetClasses.length > 0) {
      this.tabActive = this.assetClassSelected.use;
    }
  }


  onDeleteAssetClass() {
    this.openAssetClassModal = false;
    let index = this.schemeAssetClasses.findIndex(assetClass => assetClass.id === this.assetClassSelected.id);
    this.schemeAssetClasses.splice(index, 1);
    this.getAvailableAssetClassUses();

    this.onSelectAssetClass(0);
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
