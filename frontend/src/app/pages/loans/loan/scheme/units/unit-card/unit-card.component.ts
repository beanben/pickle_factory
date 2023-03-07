import { Component, Input, OnInit } from '@angular/core';
import { } from '../../scheme';
import { AssetClassType } from '../../scheme.model';
@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.css']
})
export class UnitCardComponent implements OnInit {
  @Input() assetClass = {} as AssetClassType;

  constructor() { }

  ngOnInit(): void {
  }

}
