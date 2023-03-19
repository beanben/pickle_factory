import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheme } from '../scheme';
import { AssetClassType } from '../scheme.model';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-income-and-value',
  templateUrl: './income-and-value.component.html',
  styleUrls: ['./income-and-value.component.css']
})
export class IncomeAndValueComponent implements OnInit {
  @Input() scheme = {} as Scheme;
  tabActive = "";
  isShow = true;
  @Output() onClickUnits = new EventEmitter<void>();

  constructor(
    private _loanService: LoanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setDefaultTabActive()
  }

  setDefaultTabActive(){
    this.tabActive = this.scheme.assetClasses.length > 0 ? this.scheme.assetClasses[0].use : "";
  }

  getAssetClass(assetClassUse: string): AssetClassType | undefined{
    const assetClass: AssetClassType | undefined = this.scheme.assetClasses.find(
            assetClass => assetClass.use.toLowerCase() === assetClassUse.toLowerCase()
            );

    return assetClass;
  }

  onClick(){
    this.onClickUnits.emit()
  }
  

}
