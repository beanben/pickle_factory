import { Component, Input, OnInit } from '@angular/core';
import { AssetClassType, Unit } from '../../scheme.model';

@Component({
  selector: 'app-residential',
  templateUrl: './residential.component.html',
  styleUrls: ['./residential.component.css']
})
export class ResidentialComponent implements OnInit {
  @Input() assetClass = {} as AssetClassType | undefined;

  openStrategyModal = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
