import { Component, Input, OnInit } from '@angular/core';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme } from '../scheme';
import { AssetClassType} from '../scheme.model';


@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  openUnitModal = false;
  modalMode = "";

  @Input() scheme = {} as Scheme

  constructor(
  ) { }

  ngOnInit(): void { }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(assetClass: AssetClassType | null){

    this.openUnitModal = false;


    if(assetClass){
      console.log("assetClass from inside units", assetClass);
    }
  }


}
