import { Component, Input, OnInit } from '@angular/core';
import { AssetClassType, Residential } from '../../scheme.model';

@Component({
  selector: 'app-sales-schedule',
  templateUrl: './sales-schedule.component.html',
  styleUrls: ['./sales-schedule.component.css']
})
export class SalesScheduleComponent implements OnInit {
  @Input() assetClass = {} as AssetClassType;

  constructor() { }

  ngOnInit(): void {
  }

}
