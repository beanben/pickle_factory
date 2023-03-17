import { Component, Input, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { addSpaceBetweenCapitalLetters, pascalToTitle } from 'src/app/shared/utils';
import { APIResult } from 'src/app/_services/api-result';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme } from '../scheme';
import { AssetClassType} from '../scheme.model';


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

  @Input() scheme = {} as Scheme

  constructor(
    private _schemeService: SchemeService
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

  // getAvailableAssetClassesUseChoices(){
  //   const availableAssetClassUsesSub: string[] = this._schemeService.availableAssetClassUsesSub.getValue();
  //   this.availableAssetClassUses = availableAssetClassUsesSub;

  //   if(this.availableAssetClassUses.length === 0){
  //     this.getReqAvailableAssetClassUses()
  //   }

  // } 

  // getReqAvailableAssetClassUses(){
  //   this._schemeService.getAssetClassUses()
  //     .subscribe((res: string[]) => {

  //       const assetClassUsesFormatted: string[] = [];
  //       res.forEach(choice => {
  //         assetClassUsesFormatted.push(pascalToTitle(choice))
  //       })

  //       const existingSchemeUses: string[] = this.scheme.assetClasses.map(assetClass => assetClass.use);
  //       // console.log("existingSchemeUses: ", existingSchemeUses)
  //       const availableSchemeUses: string[] = assetClassUsesFormatted.filter(
  //         assetClassUse => !existingSchemeUses.includes(assetClassUse.toLowerCase())
  //       );


  //       this.availableAssetClassUses = availableSchemeUses;
  //       this._schemeService.setAvailableAssetClassUsesSub(availableSchemeUses); 
  //     })
  // }

  onDeleteAssetClass(index: number){
    this.openUnitModal = false;

    this.availableAssetClassUses.push(
      this.scheme.assetClasses[index].use
    );
    
    this.scheme.assetClasses.splice(index, 1);
  }

  

}
