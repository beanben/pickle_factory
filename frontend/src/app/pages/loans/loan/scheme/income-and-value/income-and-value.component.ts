import { Component, Input, OnInit } from '@angular/core';
import { Scheme } from '../scheme';
import { AssetClassType, Unit } from '../scheme.model';

@Component({
  selector: 'app-income-and-value',
  templateUrl: './income-and-value.component.html',
  styleUrls: ['./income-and-value.component.css']
})
export class IncomeAndValueComponent implements OnInit {
  @Input() scheme = {} as Scheme;
  tabActive = "";
  isShow = true;

  constructor() { }

  ngOnInit(): void {
    this.setDefaultTabActive()
  }

  setDefaultTabActive(){
    this.tabActive = !!this.scheme.assetClasses ? this.scheme.assetClasses[0].use : "";
  }

  getAssetClass(assetClassUse: string): AssetClassType | undefined{
    const assetClass: AssetClassType | undefined = this.scheme.assetClasses.find(
            assetClass => assetClass.use.toLowerCase() === assetClassUse.toLowerCase()
            );

    return assetClass;
  }
  

}
