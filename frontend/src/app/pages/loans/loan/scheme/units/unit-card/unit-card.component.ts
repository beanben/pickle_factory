import { Component, Input, OnInit } from '@angular/core';
import { AssetClass, Hotel, Office, Residential, Retail, ShoppingCentre, StudentAccommodation} from '../../scheme';
@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.css']
})
export class UnitCardComponent implements OnInit {
  @Input() assetClass = {} as Hotel | Residential | Retail | StudentAccommodation | Office | ShoppingCentre;

  constructor() { }

  ngOnInit(): void {
  }

}
