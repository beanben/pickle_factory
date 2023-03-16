import { Component, Input, OnInit } from '@angular/core';
import { pascalToTitle } from 'src/app/shared/utils';
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
    // console.log("open modal from insude units compo")
    // console.log("this.scheme", this.scheme)
  }

  onSave(assetClass: AssetClassType | null){
    this.openUnitModal = false;

    if(assetClass){
      this.scheme.assetClasses.push(assetClass);
    }
  }

  getAvailableAssetClassesUseChoices(){
    const availableAssetClassUsesSub: string[] = this._schemeService.availableAssetClassUsesSub.getValue();
    this.availableAssetClassUses = availableAssetClassUsesSub;

    if(this.availableAssetClassUses.length === 0){
      this.getReqAvailableAssetClassUses()
    }

  }

  getReqAvailableAssetClassUses(){
    this._schemeService.getAssetClassUses()
      .subscribe((res: string[]) => {

        const assetClassUsesFormatted: string[] = [];
        res.forEach(choice => {
          assetClassUsesFormatted.push(pascalToTitle(choice))
        })

        const existingSchemeUses: string[] = this.scheme.assetClasses.map(assetClass => assetClass.use);
        const availableSchemeUses: string[] = assetClassUsesFormatted.filter(
          assetClassUse => !existingSchemeUses.includes(assetClassUse.toLowerCase())
        );


        this.availableAssetClassUses = availableSchemeUses;
        this._schemeService.setAvailableAssetClassUsesSub(availableSchemeUses); 
      })
  }

  onDeleteAssetClass(index: number){
    this.openUnitModal = false;

    this.availableAssetClassUses.push(
      this.scheme.assetClasses[index].use
    );
    
    this.scheme.assetClasses.splice(index, 1);
  }

  

}
