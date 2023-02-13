import { Component, Input, OnInit } from '@angular/core';
import { AssetClass, Scheme, Unit } from '../scheme';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  openUnitModal = false;
  modalMode = "";

  @Input() scheme = {} as Scheme

  constructor() { }

  ngOnInit(): void { }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(assetClass: AssetClass | null){
    this.openUnitModal = false;

    if(assetClass){
      this.scheme.assetClasses!.push(assetClass);
    }
  }

}
