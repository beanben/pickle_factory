import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Loan } from 'src/app/_interfaces/loan.interface';
import { Scheme } from 'src/app/_interfaces/scheme.interface';


@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit, OnDestroy {
  openSchemeModal = false;
  modalMode = "";
  tabActive = "units";
  @Input() loan = {} as Loan;
  @Input() scheme = {} as Scheme;
  // @Input() index = -1;
  @Output() deleteConfirmed = new EventEmitter<Scheme>();
  subs: Subscription[] = []

  // constructor( 
  //   private _schemeService: SchemeService,
  // ) { }

  ngOnInit(): void {
    // this._schemeService.setSchemeSub(this.scheme);

    // this.subs.push(
    //   this._schemeService.getSchemeSub().subscribe(scheme => {  
    //     this.scheme = scheme;
    //   }
    // ));
  }

  onOpenModal(modalMode: string) {
    this.openSchemeModal = true;
    this.modalMode = modalMode;
  }

  onDeleteScheme(scheme: Scheme) {
    this.openSchemeModal = false;
    this.deleteConfirmed.emit(scheme);

  }

  // selectUnitsTab(){
  //   this.tabActive = "units";
  // }

  // updateAssetClass(assetClass: AssetClassType | undefined){
  //   this.openSchemeModal = false;

  //   if(!!assetClass){
  //     const assetClassIndex = this.scheme.assetClasses.findIndex(ac => ac.id === assetClass.id);
  //     this.scheme.assetClasses[assetClassIndex] = assetClass;
  //   }
  // }
  onSaveScheme(scheme: Scheme | null) {
    this.openSchemeModal = false;

    if (!!scheme) {
      this.scheme = scheme;
  }
}

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}
