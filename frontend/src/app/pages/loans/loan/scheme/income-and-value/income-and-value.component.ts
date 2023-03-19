import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheme } from '../scheme';
import { AssetClassType, Commercial, Hotel, Office, Residential, ShoppingCentre, StudentAccommodation } from '../scheme.model';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-income-and-value',
  templateUrl: './income-and-value.component.html',
  styleUrls: ['./income-and-value.component.css']
})
export class IncomeAndValueComponent implements OnInit {
  openStrategyModal = false;
  tabActive = "";
  isShow = true;
  modalMode = "";
  investmentStrategy = "";
  strategyModalMode = "";
  expandSalesSchedule = false;
  expandSalesVelocity = false;
  expandTenancySchedule = false;
  expandLettingAssumptions = false;

  @Input() scheme = {} as Scheme;
  assetClassSelected = {} as AssetClassType;
  @Output() onClickUnits = new EventEmitter<void>();

  constructor(
    private _loanService: LoanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setSelectedAssetClass(0)
    this.setDefaultTabActive()
  }

  setSelectedAssetClass(index: number){
    this.assetClassSelected = this.scheme.assetClasses.length > 0 ? this.scheme.assetClasses[index] : {} as AssetClassType;
    this.investmentStrategy = this.setInvestmentStrategy(this.assetClassSelected);
  }

  setDefaultTabActive(){
    this.tabActive = Object.keys(this.assetClassSelected).length > 0 ? this.assetClassSelected.use : "";
  }

  // getAssetClass(assetClassUse: string): AssetClassType | undefined{
  //   const assetClass: AssetClassType | undefined = this.scheme.assetClasses.find(
  //           assetClass => assetClass.use.toLowerCase() === assetClassUse.toLowerCase()
  //           );

  //   return assetClass
  // }

  onClick(){
    this.onClickUnits.emit()
  }

  updateAssetClass(assetClass: AssetClassType | undefined){
    this.openStrategyModal = false;

    if(!!assetClass){
      this.assetClassSelected = assetClass;
      // const assetClassIndex = this.scheme.assetClasses.findIndex(assetClass => assetClass.id === assetClass.id)
      // this.scheme.assetClasses[assetClassIndex] = assetClass;

      // const assetClass: AssetClassType = this.scheme.assetClasses.find(
      //   (schemeAssetClass: AssetClassType) => schemeAssetClass.id = assetClass.id
      // ) as AssetClassType;

      // this.assetClass = assetClass;
      this.investmentStrategy = this.setInvestmentStrategy(assetClass);
    };
  }

  setInvestmentStrategy(assetClass: AssetClassType): string{
    const investmentStrategyValueDisplay: {[key:string]: string} = {
      "buildToRent": "build to rent",
      "buildToSell": "build to sell",
    }
    return investmentStrategyValueDisplay[assetClass.investmentStrategy!];
  }

  onOpenStrategyModal(mode: string){
    this.strategyModalMode = mode;
    this.openStrategyModal = true;
  }

  onSelectTab(index:number){
    this.setSelectedAssetClass(index);
    this.setDefaultTabActive()
  }
  

}
