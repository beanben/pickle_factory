import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaseStructure, UnitStructure } from 'src/app/_interfaces/scheme.interface';
import { AssetClassType } from 'src/app/_types/custom.type';

@Component({
  selector: 'app-upload-step-one',
  templateUrl: './upload-step-one.component.html',
  // styleUrls: ['./upload-step-one.component.css']
})
export class UploadStepOneComponent implements OnInit {
  private parametresSubject = new BehaviorSubject<string[]>([]);
  parametres$: Observable<string[]> = this.parametresSubject.asObservable();
  @Input() unitStructure = {} as UnitStructure;
  @Input() leaseStructure = {} as LeaseStructure;
  @Input() assetClass = {} as AssetClassType;
  information = 'assets/images/information.svg';
  @Output() checkboxChanged = new EventEmitter<boolean>();

  _isChecked = false;
  get isChecked(): boolean {
    return this._isChecked;
  }
  set isChecked(value: boolean) {
    this._isChecked = value;
    this.onCheckboxChange();
  }
  

  constructor() { }

  ngOnInit(): void {
    const parametres = this.getParametres();
    this.parametresSubject.next(parametres);
  }

  getParametres(): string[]{
    const parameters: string[] = [];

    const unitParametre = this.unitParametre();
    if(this.assetClass.investmentStrategy === 'buildToSell'){
      const saleParametre = this.saleParametre();
      parameters.push(...unitParametre, ...saleParametre);

    }else{
      const leaseParametre = this.leaseParametre();
      parameters.push(...unitParametre, ...leaseParametre);
    }

    return parameters;
  }

  unitParametre(): string[] {
    const unitParametre: string[] = [];
    unitParametre.push(
      this.unitStructure.label + ' identifier',
      'description',
      this.unitStructure.areaType + ' (' + this.unitStructure.areaSystem + ')'
    );
    if(this.unitStructure.hasBeds){
      unitParametre.push('beds');
    }
    return unitParametre
  }

  saleParametre(): string[] {
    const saleParametre: string[] = [];

    saleParametre.push(
      'ownership type',
      'target price',
      'price achieved',
      'sale status',
      'sale status date',
      'buyer',
    )

    return saleParametre
  }

  leaseParametre(): string[] {
    const leaseParametre: string[] = [];

    let frequency = '';
    if(this.leaseStructure.rentFrequency === 'perWeek'){
      frequency = 'per week';
    }else{
      frequency = 'per month';
    }

    leaseParametre.push(
      'lease type',
      'rent target' + ' (' + frequency + ')',
      'rent achieved' + ' (' + frequency + ')',
      'lease start date',
      'lease end date',
      'tenant',
    )

    return leaseParametre
  }

  getLetter(index: number): string{
    return String.fromCharCode(65 + index);
  }

  onCheckboxChange() {
    this.checkboxChanged.emit(this.isChecked);
  }

}
