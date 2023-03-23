import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { addSpaceBetweenCapitalLetters } from 'src/app/shared/utils';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme } from '../scheme';
import { AssetClassType} from '../scheme.model';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit, OnDestroy {
  openUnitModal = false;
  modalMode = "";
  availableAssetClassUses: string[] = [];
  assetClassUses: string[] = [];
  subs: Subscription[] = []

  @Input() scheme = {} as Scheme;

  constructor(
    private _schemeService: SchemeService,
  ) { }

  async ngOnInit(): Promise<void> {
    const assetClassUses = await lastValueFrom(this._schemeService.getAssetClassUses());
    this.assetClassUses = assetClassUses.map(assetClassName => addSpaceBetweenCapitalLetters(assetClassName));

    this.getAvailableAssetClassesUseChoices();
  }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(assetClass: AssetClassType | null){
    this.openUnitModal = false;

    if(assetClass){
      this.scheme.assetClasses.push(assetClass);
      this.getAvailableAssetClassesUseChoices();
    }

  }

  getAvailableAssetClassesUseChoices(){
    const existingSchemeUses: string[] = this.scheme.assetClasses.map(assetClass => assetClass.use.toLowerCase());
    this.availableAssetClassUses = this.assetClassUses.filter(
            assetClassUse => !existingSchemeUses.includes(assetClassUse.toLowerCase())
    );

    this._schemeService.setAvailableAssetClassUsesSub(this.availableAssetClassUses);
  }


  onDeleteAssetClass(index: number){
    this.openUnitModal = false;

    this.availableAssetClassUses.push(
      this.scheme.assetClasses[index].use
    );
    
    this.scheme.assetClasses.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
