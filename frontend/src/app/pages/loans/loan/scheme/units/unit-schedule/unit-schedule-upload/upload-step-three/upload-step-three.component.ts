import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UnitService} from 'src/app/_services/unit/unit.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-step-three',
  templateUrl: './upload-step-three.component.html',
  styleUrls: ['./upload-step-three.component.css']
})
export class UploadStepThreeComponent implements OnInit, OnDestroy {
  @Input() data = {} as Uint8Array;
  @Output() headerFormStatusChange = new EventEmitter<FormGroup>();
  dataForm = {} as FormGroup;
  fileName = '';
  subs: Subscription[] = [];
  headersForm: FormGroup = new FormGroup({
    headersArray: new FormArray([])
  });
  nextIsClicked = false;
  parametresRequired: string[] = [];

  get headersArray(): FormArray {
    return this.headersForm.get('headersArray') as FormArray;
  }

  constructor(private _unitService: UnitService) {}

  ngOnInit(): void {
    this.subs.push(
      this._unitService.getFileNameSub().subscribe(fileName => {
        this.fileName = fileName;
      })
    );

    this.subs.push(
      this._unitService.getParametersRequiredSub().subscribe(parametresRequired => {
        this.parametresRequired = parametresRequired;
        this.onFileUploaded();
        this.headerFormStatusChange.emit(this.headersForm);
      }),
      this.headersForm.statusChanges.subscribe(status => {
        this.headerFormStatusChange.emit(this.headersForm);
      })
    );

  }

  onFileUploaded() {
    const headers = this.extractFileHeaders(this.data, this.fileName);
    if (this.parametresRequired.length > 0) {
      this.headersForm = this.createFormFromHeaders(headers, this.parametresRequired);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private extractFileHeaders(fileData: Uint8Array, fileName: string): string[] {
    let headers: string[] = [];

    if (fileName.endsWith('.csv')) {
      headers = this.extractCSVFileHeaders(fileData);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      headers = this.extractExcelFileHeaders(fileData);
    }

    return headers;
  }

  private extractCSVFileHeaders(fileData: Uint8Array): string[] {
    const csvString = new TextDecoder('utf-8').decode(fileData);
    const lines = csvString.split('\n').filter(line => line.trim() !== '');

    return lines.map(line => line.split(','))[0];
  }

  private extractExcelFileHeaders(fileData: Uint8Array): string[] {
    const workbook = XLSX.read(fileData, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: true});

    const nonEmptyRows = rows.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
    return nonEmptyRows[0];
  }

  private createFormFromHeaders(headers: string[], requiredValues: string[]): FormGroup {
    const headersArray = new FormArray(
      headers.map(
        (header, index) =>
          new FormGroup({
            header: new FormControl(header.trim(), [Validators.required, this.isEqualTo(requiredValues[index])])
          })
      )
    );

    return new FormGroup({headersArray});
  }

  private isEqualTo(expectedValue: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return control.value.toLowerCase() === expectedValue.toLowerCase() ? null : {notEqual: true};
    };
  }
}
