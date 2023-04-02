import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Scheme } from '../scheme';
import { AssetClassType} from '../scheme.model';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';


@Component({
  selector: 'app-income-and-value',
  templateUrl: './income-and-value.component.html',
  styleUrls: ['./income-and-value.component.css']
})
export class IncomeAndValueComponent implements OnInit, OnDestroy {
  openStrategyModal = false;
  tabActive = "";
  isShow = true;
  modalMode = "";
  investmentStrategy = "";
  strategyModalMode = "";
  expandSalesSchedule = true;
  expandSalesVelocity = false;
  expandTenancySchedule = false;
  expandLettingAssumptions = false;

  @Input() scheme = {} as Scheme;
  // scheme = {} as Scheme;
  assetClassSelected = {} as AssetClassType;
  @Output() onClickUnits = new EventEmitter<void>();
  subs: Subscription[] = []

  constructor(
    private _loanService: LoanService,
    private router: Router,
    private _schemeService: SchemeService,
  ) { }

  ngOnInit(): void {
    this.setSelectedAssetClass(0);
    this.setDefaultTabActive();
    this._schemeService.setSchemeSub(this.scheme);

    this.subs.push(
      this._schemeService.getSchemeSub()
      .subscribe(scheme => {
        this.scheme = scheme;
        this.refreshAssetClassSelected();
        })
    )
  }

  refreshAssetClassSelected(){
    console.log("refreshAssetClassSelected");
    const index: number = this.scheme.assetClasses.findIndex(assetClass => assetClass.id === this.assetClassSelected.id);
    this.assetClassSelected = this.scheme.assetClasses[index];

    console.log("index:", index);
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
  
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}
