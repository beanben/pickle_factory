import { Component, Input, OnInit } from '@angular/core';
import { AssetClassType } from '../../scheme.model';

@Component({
  selector: 'app-residential',
  templateUrl: './residential.component.html',
  styleUrls: ['./residential.component.css']
})
export class ResidentialComponent implements OnInit {
  minus = "assets/images/minus.jpg";
  plus = "assets/images/plus.jpg";
  @Input() assetClass = {} as AssetClassType | undefined;
  investmentStrategy: string | undefined = "";
  modalMode = "";
  openStrategyModal = false;
  expandSalesSchedule = false;
  expandSalesVelocity = false;
  expandTenancySchedule = false;
  expandLettingAssumptions = false;
  
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
