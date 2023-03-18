import { Component, Input, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { addSpaceBetweenCapitalLetters } from 'src/app/shared/utils';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme } from '../scheme';
import { AssetClassType} from '../scheme.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  openUnitModal = false;
  modalMode = "";
  availableAssetClassUses: string[] = [];
  assetClassUses: string[] = [];

  @Input() scheme = {} as Scheme;

  constructor(
    private _schemeService: SchemeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void { 
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
    }

  }

  async getAvailableAssetClassesUseChoices(){
    // this.scheme = await this.getScheme();

    this.assetClassUses = await this.getAssetClassUses()
    this._schemeService.setAssetClassUsesSub(this.assetClassUses); 

    const existingSchemeUses: string[] = this.scheme.assetClasses.map(assetClass => assetClass.use);
    const availableSchemeUses: string[] = this.assetClassUses.filter(
            assetClassUse => !existingSchemeUses.includes(assetClassUse.toLowerCase())
    );

    this.availableAssetClassUses = availableSchemeUses;
  } 

  async getAssetClassUses(): Promise<string[]>{
    const assetClassUsesSub: string[] = this._schemeService.assetClassUsesSub.getValue();
    if(assetClassUsesSub.length !== 0){
      return assetClassUsesSub;
    }

    const assetClassNames: string[] = await lastValueFrom(this._schemeService.getAssetClassUses());
    const assetClassUses = assetClassNames.map(assetClassName => addSpaceBetweenCapitalLetters(assetClassName))

    return assetClassUses
  }

  onDeleteAssetClass(index: number){
    this.openUnitModal = false;

    this.availableAssetClassUses.push(
      this.scheme.assetClasses[index].use
    );
    
    this.scheme.assetClasses.splice(index, 1);
  }

  // async getScheme(): Promise<Scheme>{
  //   const schemeId = this.route.snapshot.params['schemeId'];
  //   let scheme = {} as Scheme;

  //   if(!!schemeId){
  //     scheme = await lastValueFrom(this._schemeService.getScheme(schemeId));
  //   };

  //   return scheme;
  // }

}
