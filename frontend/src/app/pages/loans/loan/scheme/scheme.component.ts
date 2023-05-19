import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription, lastValueFrom } from 'rxjs';
import { Loan } from 'src/app/_interfaces/loan.interface';
import { AssetClassUnits, Scheme, Unit } from 'src/app/_interfaces/scheme.interface';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { AssetClassType } from 'src/app/_types/custom.type';


@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit, OnDestroy,  OnChanges{
  openSchemeModal = false;
  modalMode = "";
  tabActive = "units";
  @Input() loan = {} as Loan;
  @Input() scheme = {} as Scheme;
  @Output() deleteConfirmed = new EventEmitter<Scheme>();
  subs: Subscription[] = [];
  schemeData: AssetClassUnits[] = [];

  constructor( 
    private _schemeService: SchemeService,
  ) { }

  ngOnInit(): void {
    if(this.scheme.id) {
      this.setSchemeDataSub();
    };

    this.subs.push(
      this._schemeService.getSchemeDataSub()
      .subscribe((schemeData: AssetClassUnits[]) => {
        this.schemeData = schemeData;
        console.log("from scheme compo: ", schemeData)
      })
    );
  }

  setSchemeDataSub() {
    this.getSchemeData(this.scheme)
      .then(schemeData => {
        this._schemeService.setSchemeDataSub(schemeData);
      })
      .catch(error => {
        console.error('Error while fetching scheme data:', error);
      });
  }

  async getSchemeData(scheme: Scheme) {
    const schemeData: AssetClassUnits[] = [];

    try {
      const assetClasses$ = this._schemeService.getSchemeAssetClasses(scheme);
      const assetClasses: AssetClassType[] = await lastValueFrom(assetClasses$);

      for (let i = 0; i < assetClasses.length; i++) {
        const assetClass = assetClasses[i];
        const units$ = this._schemeService.getAssetClassUnits(assetClass);
        const units: Unit[] = await lastValueFrom(units$);
        const assetClassUnit = {assetClass, units} as AssetClassUnits;
        schemeData.push(assetClassUnit);
      }
    } catch (error) {
      console.error('Error while fetching asset classes and units:', error);
    }

    return schemeData;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scheme'] && changes['scheme'].currentValue) {
      const scheme: Scheme = changes['scheme'].currentValue;

      this.setSchemeDataSub();
    }
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
