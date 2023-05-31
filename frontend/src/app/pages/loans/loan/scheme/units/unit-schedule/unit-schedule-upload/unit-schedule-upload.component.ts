import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {LeaseStructure, UnitScheduleData, UnitStructure} from 'src/app/_interfaces/scheme.interface';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {UnitService} from 'src/app/_services/unit/unit.service';
import {AssetClassType} from 'src/app/_types/custom.type';

@Component({
  selector: 'app-unit-schedule-upload',
  templateUrl: './unit-schedule-upload.component.html'
  // styleUrls: ['./unit-schedule-upload.component.css']
})
export class UnitScheduleUploadComponent implements OnInit {
  displayStyle = 'block';
  isChecked = false;
  // isUploadError = false;
  selectFileStatus = 'active';
  dataValidationStatus = 'inactive';
  uploadStatus = 'inactive';
  step = 1;
  data = {} as Uint8Array;
  headerFormIsValid = false;
  dataIsLoaded = false;

  @Output() modalUploadUnitSchedule = new EventEmitter<UnitScheduleData[] | null>();
  @Input() unitStructure = {} as UnitStructure;
  @Input() leaseStructure = {} as LeaseStructure;
  @Input() assetClass = {} as AssetClassType;
  @Input() ownershipTypeChoices: Choice[] = [];
  @Input() leaseTypeChoices: Choice[] = [];
  @Input() saleStatusChoices: Choice[] = [];

  constructor(private el: ElementRef, private _unitService: UnitService) {}

  ngOnInit(): void {
    this.addEventBackgroundClose();
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  }

  onCancel() {
    this.modalUploadUnitSchedule.emit(null);
    this._unitService.setFileNameSub('');
  }

  onNext() {
    this.step += 1;
  }

  onPrevious() {
    this.step--;
  }

  onCheckboxChanged(isChecked: boolean) {
    this.isChecked = isChecked;
  }

  handleDataUpload(data: Uint8Array) {
    this.data = data;
    this.dataIsLoaded = true;

  }

  handleHeaderFormChange(form: FormGroup) {
    this.headerFormIsValid = form.valid;
  }

  disableNext(): boolean {
    if (this.step === 1) {
      return !this.isChecked;
    }else if(this.step === 2){
      return !this.dataIsLoaded;
    } else if (this.step === 3) {
      return !this.headerFormIsValid;
    } else {
      return false;
    }
  }
}
