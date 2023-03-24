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
  // scheme = {} as Scheme;

  constructor(
    private _schemeService: SchemeService,
  ) { }

  async ngOnInit(): Promise<void> {
    const assetClassUses = await lastValueFrom(this._schemeService.getAssetClassUses());
    this.assetClassUses = assetClassUses.map(assetClassName => addSpaceBetweenCapitalLetters(assetClassName));

    this.getAvailableAssetClassesUseChoices();

    // this.subs.push(
    //   this._schemeService.getSchemeSub().subscribe(scheme => {  
    //     this.scheme = scheme;
    //     this.getAvailableAssetClassesUseChoices();
    //   }
    // ));
  }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(assetClass: AssetClassType | null){
    this.openUnitModal = false;

    if(assetClass){
      // if assetClass is already in the scheme, update it
      const assetClassIndex = this.scheme.assetClasses.findIndex(
        schemeAssetClass => schemeAssetClass.use.toLowerCase() === assetClass.use.toLowerCase()
      );
      if(assetClassIndex !== -1){
        this.scheme.assetClasses[assetClassIndex] = assetClass;
      }
      // else add it to the scheme
      this.scheme.assetClasses.push(assetClass);
      this.getAvailableAssetClassesUseChoices();
      
      this._schemeService.setSchemeSub(this.scheme);
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

  onCloseModal(){
    this.openUnitModal = false;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
