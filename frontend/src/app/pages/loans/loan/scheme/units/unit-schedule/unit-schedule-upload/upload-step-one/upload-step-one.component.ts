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
import {BehaviorSubject, Observable, Subscription, lastValueFrom} from 'rxjs';
import {FieldOption, LeaseStructure, UnitStructure} from 'src/app/_interfaces/scheme.interface';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {SharedService} from 'src/app/_services/shared/shared.service';
import { UnitService } from 'src/app/_services/unit/unit.service';
import {AssetClassType} from 'src/app/_types/custom.type';
import {toTitleCase} from 'src/app/shared/utils';



@Component({
  selector: 'app-upload-step-one',
  templateUrl: './upload-step-one.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
  // styleUrls: ['./upload-step-one.component.css']
})
export class UploadStepOneComponent implements OnInit, OnChanges {
  @Input() unitStructure = {} as UnitStructure;
  @Input() leaseStructure = {} as LeaseStructure;
  @Input() assetClass = {} as AssetClassType;
  information = 'assets/images/information.svg';
  @Output() checkboxChanged = new EventEmitter<boolean>();

  @Input() ownershipTypeChoices: Choice[] = [];
  @Input() saleStatusChoices: Choice[] = [];
  @Input() leaseTypeChoices: Choice[] = [];

  parameters = {
    unitParametre: [] as string[],
    saleParametre: [] as string[],
    leaseParametre: [] as string[]
  };
  parametresDisplayed: string[] = [];

  parametersOptions = {
    saleOptions: [] as FieldOption[],
    leaseOptions: [] as FieldOption[]
  };
  parametersOptionsDisplayed: FieldOption[] = [];

  unitFields: string[] = [];
  saleFields: string[] = [];
  leaseFields: string[] = [];

  subs: Subscription[] = [];

  _isChecked = false;
  get isChecked(): boolean {
    return this._isChecked;
  }
  set isChecked(value: boolean) {
    this._isChecked = value;
    this.onCheckboxChange();
  }

  constructor(
    private _sharedService: SharedService,
    private _unitService: UnitService) {}

  async ngOnInit() {
    this.unitFields = await this.getFields('unit');
    this.saleFields = await this.getFields('sale');
    this.leaseFields = await this.getFields('lease');
    await this.setParametersAndOptions();
    this.defineParametreAndOptions(this.assetClass.investmentStrategy);

    // subscribe to paranetree required & set them in the below
    // COTINUE HERE
  }

  

  defineParametreAndOptions(investmentStrategy: string) {
    const parameters: string[] = [];
    const parametersOptions: FieldOption[] = [];

    if (investmentStrategy === 'buildToSell') {
      parameters.push(...this.parameters.unitParametre, ...this.parameters.saleParametre);

      parametersOptions.push(...this.parametersOptions.saleOptions);
    }

    if (investmentStrategy === 'buildToRent') {
      parameters.push(...this.parameters.unitParametre, ...this.parameters.leaseParametre);

      parametersOptions.push(...this.parametersOptions.leaseOptions);
    }
    
    if(parameters.length === 0) {
      this.parametresDisplayed = this._unitService.parametresDisplayed;
      this.parametersOptionsDisplayed = this._unitService.parametersOptionsDisplayed;
    } else {
      this.parametresDisplayed = parameters;
      this.parametersOptionsDisplayed = parametersOptions;
      this._unitService.parametresDisplayed = parameters;
      this._unitService.parametersOptionsDisplayed = parametersOptions;
      this._unitService.setParametersRequiredSub(parameters)
    }

    // this.parametresDisplayed = parameters;
    // this.parametersOptionsDisplayed = parametersOptions;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['assetClass'] && changes['assetClass'].currentValue) {
      
      this.defineParametreAndOptions(this.assetClass.investmentStrategy);
    // }
  }

  setParametersAndOptions() {
    this.parameters = {
      unitParametre: this.setParametres('unit', this.unitFields),
      saleParametre: this.setParametres('sale', this.saleFields),
      leaseParametre: this.setParametres('lease', this.leaseFields)
    };

    this.parametersOptions = {
      leaseOptions: this.setParametreOptions('lease', this.leaseFields),
      saleOptions: this.setParametreOptions('sale', this.saleFields)
    };
  }

  setParametres(model: string, fields: string[]): string[] {
    fields = fields.map(field => toTitleCase(field));

    fields = fields.filter(field => {
      return !field.toLowerCase().includes('id') || field.toLowerCase().includes('identifier');
    });

    if (model === 'unit') {
      fields = fields.filter(field => {
        return field.toLowerCase() !== 'label' && !field.toLowerCase().includes('area');
      });

      if(!this.unitStructure.hasBeds){
        fields = fields.filter(field => {
          return field.toLowerCase() !== 'beds';
        });
      }

      const area = this.unitStructure.areaType.toUpperCase() + ' (' + this.unitStructure.areaSystem + ')';
      fields.push(area);
    }

    // if (model === 'sale') {
    //   fields = fields.map(field => {
    //     if (field.toLowerCase() === 'ownership type') {
    //       return 'type';
    //     }
    //     return field;
    //   });
    // }

    return fields;
  }

  async getFields(model: string) {
    const fields$ = this._sharedService.getFields(model);
    let fields = await lastValueFrom(fields$);
    return fields;
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  onCheckboxChange() {
    this.checkboxChanged.emit(this.isChecked);
  }

  setParametreOptions(model: string, fields: string[]): FieldOption[] {
    const fieldOptions: FieldOption[] = [];

    if (model === 'sale') {
      fieldOptions.push(
        {name: 'Ownership type', options: this.ownershipTypeChoices.map(choice => choice.label)},
        {name: 'Sale status', options: this.saleStatusChoices.map(choice => choice.label)}
      );
    }

    if (model === 'lease') {
      fieldOptions.push({name: 'Lease type', options: this.leaseTypeChoices.map(choice => choice.label)});
    }

    return fieldOptions;
  }
}
