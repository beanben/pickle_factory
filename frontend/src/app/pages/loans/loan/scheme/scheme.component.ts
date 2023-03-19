import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheme } from './scheme';
import { AssetClassType } from './scheme.model';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit{
  openSchemeModal = false;
  modalMode = "";
  tabActive = "incomeAndValue";

  @Input() scheme = {} as Scheme;
  @Input() index = -1;
  @Output() deleteConfirmed = new EventEmitter<number>();

  constructor( 
  ) { }

  ngOnInit(): void {  }

  onOpenModal(modalMode: string){
    this.openSchemeModal = true;
    this.modalMode = modalMode;
  }

  onDeleteScheme(){
    this.openSchemeModal = false;
    this.deleteConfirmed.emit(this.index);
  }
  
  selectUnitsTab(){
    this.tabActive = "units";
  }

  // updateAssetClass(assetClass: AssetClassType | undefined){
  //   this.openSchemeModal = false;

  //   if(!!assetClass){
  //     const assetClassIndex = this.scheme.assetClasses.findIndex(ac => ac.id === assetClass.id);
  //     this.scheme.assetClasses[assetClassIndex] = assetClass;
  //   }
  // }

}
