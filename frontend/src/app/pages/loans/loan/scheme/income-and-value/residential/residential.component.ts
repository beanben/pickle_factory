import { Component, Input, OnInit } from '@angular/core';
import { toTitleCase } from 'src/app/shared/utils';
import { AssetClassType, Unit } from '../../scheme.model';

@Component({
  selector: 'app-residential',
  templateUrl: './residential.component.html',
  styleUrls: ['./residential.component.css']
})
export class ResidentialComponent implements OnInit {
  @Input() assetClass = {} as AssetClassType | undefined;
  investmentStrategy: string | undefined = "";
  modalMode = "";
  openStrategyModal = false;
  
  constructor() { }

  ngOnInit(): void {
    this.investmentStrategy = this.setInvestmentStrategy();
  }

  updateAssetClass(assetClass: AssetClassType | undefined){
    this.openStrategyModal = false;

    if(!!assetClass){
      this.assetClass = assetClass;
      this.investmentStrategy = this.setInvestmentStrategy();
    };
  }

  setInvestmentStrategy(): string | undefined{
    const investmentStrategyValueDisplay: {[key:string]: string} = {
      "buildToRent": "build to rent",
      "buildToSell": "build to sell",
    }

    if(!this.assetClass){
      return
    }
    if(!this.assetClass.investmentStrategy || this.assetClass.investmentStrategy === ""){
      return
    }

    return investmentStrategyValueDisplay[this.assetClass.investmentStrategy];
  }

  onOpenModal(mode: string){
    this.modalMode = mode;
    this.openStrategyModal = true;
  }

}
