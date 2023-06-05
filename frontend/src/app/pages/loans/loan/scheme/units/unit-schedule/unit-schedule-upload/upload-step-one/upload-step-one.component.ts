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
import {Observable} from 'rxjs';
import {FieldOption, Scheme} from 'src/app/_interfaces/scheme.interface';
import {SharedService} from 'src/app/_services/shared/shared.service';
import {UnitService} from 'src/app/_services/unit/unit.service';
import {AssetClassType} from 'src/app/_types/custom.type';

@Component({
  selector: 'app-upload-step-one',
  templateUrl: './upload-step-one.component.html'
})
export class UploadStepOneComponent implements OnInit, OnChanges {
  parametresRequired: string[] = [];
  @Input() assetClass = {} as AssetClassType;
  information = 'assets/images/information.svg';
  @Input() scheme = {} as Scheme;
  @Output() checkboxChanged = new EventEmitter<boolean>();
  parametersOptions$: Observable<FieldOption[]> | undefined;

  _isChecked = false;
  get isChecked(): boolean {
    return this._isChecked;
  }
  set isChecked(value: boolean) {
    this._isChecked = value;
    this.onCheckboxChange();
  }

  constructor(private _sharedService: SharedService, private _unitService: UnitService) {}

  ngOnInit() {
    this.parametresRequired = this._unitService.displayUnitScheduleFields(this.assetClass, this.scheme);
    this._unitService.setParametersRequiredSub(this.parametresRequired);
    this.parametersOptions$ = this._unitService.displayUnitScheduleFieldsOptions(this.assetClass);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass'] && changes['assetClass'].currentValue) {
      this.parametresRequired = this._unitService.displayUnitScheduleFields(this.assetClass, this.scheme);
      this._unitService.setParametersRequiredSub(this.parametresRequired);
      this.parametersOptions$ = this._unitService.displayUnitScheduleFieldsOptions(this.assetClass);
    }
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  onCheckboxChange() {
    this.checkboxChanged.emit(this.isChecked);
  }
}
