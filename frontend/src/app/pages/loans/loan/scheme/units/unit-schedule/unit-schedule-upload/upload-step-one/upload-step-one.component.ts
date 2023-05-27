import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {BehaviorSubject, Observable, lastValueFrom} from 'rxjs';
import {LeaseStructure, UnitStructure} from 'src/app/_interfaces/scheme.interface';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {SharedService} from 'src/app/_services/shared/shared.service';
import {AssetClassType} from 'src/app/_types/custom.type';

interface FieldOption {
  fieldName: string;
  choicesLabels: string[];
}

@Component({
  selector: 'app-upload-step-one',
  templateUrl: './upload-step-one.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
  // styleUrls: ['./upload-step-one.component.css']
})
export class UploadStepOneComponent implements OnInit, OnChanges {
  private parametresSubject = new BehaviorSubject<string[]>([]);
  parametres$: Observable<string[]> = this.parametresSubject.asObservable();
  private fieldOptionsSubject = new BehaviorSubject<FieldOption[]>([]);
  fieldOptions$: Observable<FieldOption[]> = this.fieldOptionsSubject.asObservable();

  @Input() unitStructure = {} as UnitStructure;
  @Input() leaseStructure = {} as LeaseStructure;
  @Input() assetClass = {} as AssetClassType;
  information = 'assets/images/information.svg';
  @Output() checkboxChanged = new EventEmitter<boolean>();
  // fieldOptions: FieldOption[] = [];
  @Input() ownershipTypeChoices: Choice[] = [];
  @Input() saleStatusChoices: Choice[] = [];
  @Input() leaseTypeChoices: Choice[] = [];

  _isChecked = false;
  get isChecked(): boolean {
    return this._isChecked;
  }
  set isChecked(value: boolean) {
    this._isChecked = value;
    this.onCheckboxChange();
  }

  constructor(private _sharedService: SharedService) {}

  ngOnInit() {
    this.updateParametersAndFieldOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {unitStructure, leaseStructure, assetClass} = changes;

    if (unitStructure?.currentValue || leaseStructure?.currentValue || assetClass?.currentValue) {
      this.updateParametersAndFieldOptions();
    }
    
    // if (this.isAnyChoiceChanged(changes)) {
    //   this.setFieldOptions();
    // }
  }

  // async getChoices(choiceType: string): Promise<Choice[]> {
  //   const choices$ = this._sharedService.getChoices(choiceType);
  //   return await lastValueFrom(choices$);
  // }

  updateParametersAndFieldOptions() {
    const parametres = this.getParametres();
    this.parametresSubject.next(parametres);
    this.setFieldOptions();
  }

  getParametres(): string[] {
    const parameters: string[] = [];

    const unitParametre = this.unitParametre();
    if (this.assetClass.investmentStrategy === 'buildToSell') {
      const saleParametre = this.saleParametre();
      parameters.push(...unitParametre, ...saleParametre);
    } else {
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
    if (this.unitStructure.hasBeds) {
      unitParametre.push('beds');
    }
    return unitParametre;
  }

  saleParametre(): string[] {
    const saleParametre: string[] = [];

    saleParametre.push('ownership type', 'target price', 'price achieved', 'sale status', 'sale status date', 'buyer');

    return saleParametre;
  }

  leaseParametre(): string[] {
    const leaseParametre: string[] = [];

    let frequency = '';
    if (this.leaseStructure.rentFrequency === 'perWeek') {
      frequency = 'per week';
    } else {
      frequency = 'per month';
    }

    leaseParametre.push(
      'lease type',
      'rent target' + ' (' + frequency + ')',
      'rent achieved' + ' (' + frequency + ')',
      'lease start date',
      'lease end date',
      'tenant'
    );

    return leaseParametre;
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  onCheckboxChange() {
    this.checkboxChanged.emit(this.isChecked);
  }

  setFieldOptions() {
    const fieldOptions: FieldOption[] = [];

    if (this.assetClass.investmentStrategy === 'buildToSell') {
      fieldOptions.push(
        {fieldName: 'Ownership type', choicesLabels: this.ownershipTypeChoices.map(choice => choice.label)},
        {fieldName: 'Sale status', choicesLabels: this.saleStatusChoices.map(choice => choice.label)}
      );
    } else if (this.assetClass.investmentStrategy === 'buildToRent') {
      fieldOptions.push({fieldName: 'Lease type', choicesLabels: this.leaseTypeChoices.map(choice => choice.label)});
    }

    this.fieldOptionsSubject.next(fieldOptions);

    // this.fieldOptions = fieldOptions;
  }

  // private isAnyStructureChanged(changes: SimpleChanges): boolean {
  //   const {unitStructure, leaseStructure, assetClass} = changes;
  //   return unitStructure?.currentValue || leaseStructure?.currentValue || assetClass?.currentValue;
  // }

  // private isAnyChoiceChanged(changes: SimpleChanges): boolean {
  //   const {ownershipTypeChoices, saleStatusChoices, leaseTypeChoices} = changes;
  //   return (
  //     ownershipTypeChoices?.currentValue?.length &&
  //     saleStatusChoices?.currentValue?.length &&
  //     leaseTypeChoices?.currentValue?.length
  //   );
  // }
}
