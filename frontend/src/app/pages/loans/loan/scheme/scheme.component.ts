import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme } from './scheme';
import { AssetClassType } from './scheme.model';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit, OnDestroy{
  openSchemeModal = false;
  modalMode = "";
  tabActive = "incomeAndValue";

  @Input() scheme = {} as Scheme;
  @Input() index = -1;
  @Output() deleteConfirmed = new EventEmitter<number>();
  subs: Subscription[] = []

  constructor( 
    private _schemeService: SchemeService,
  ) { }

  ngOnInit(): void {
    this._schemeService.setSchemeSub(this.scheme);

    this.subs.push(
      this._schemeService.getSchemeSub().subscribe(scheme => {  
        this.scheme = scheme;
      }
    ));
  }

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

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}
