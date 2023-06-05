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
export class UploadStepThreeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data = {} as Uint8Array;
  // @Output() headerFormStatusChange = new EventEmitter<FormGroup>();
  dataForm = {} as FormGroup;
  fileName = '';
  subs: Subscription[] = [];
  form: FormGroup = new FormGroup({
    content: new FormArray([])
  });
  // nextIsClicked = false;
  // parametresRequired: string[] = [];

  get content(): FormArray {
    return this.form.get('content') as FormArray;
  }

  constructor(private _unitService: UnitService) {}

  ngOnInit(): void {
    this.subs.push(
      this._unitService.getFileNameSub().subscribe(fileName => {
        this.fileName = fileName;
      })
    );

    // this.subs.push(
    //   this._unitService.getParametersRequiredSub().subscribe(parametresRequired => {
    //     this.parametresRequired = parametresRequired;
    //     this.onFileUploaded();
    //     this.headerFormStatusChange.emit(this.headersForm);
    //   }),
    //   this.headersForm.statusChanges.subscribe(status => {
    //     this.headerFormStatusChange.emit(this.headersForm);
    //   })
    // );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.onFileUploaded();
    }
  }

  onFileUploaded() {
    const content = this.extractFileContent(this.data, this.fileName);
    // this.form = this.createFormFromContent(content);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private extractFileContent(fileData: Uint8Array, fileName: string): string[][] {
    let content: string[][] = [];

    if (fileName.endsWith('.csv')) {
      content = this.extractCSVFileContent(fileData);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      content = this.extractExcelFileContent(fileData);
    }

    return content;
  }

  private extractCSVFileContent(fileData: Uint8Array): string[][] {
    const csvString = new TextDecoder('utf-8').decode(fileData);
    const lines = csvString.split('\n').filter(line => line.trim() !== '');

    return lines.map(line => line.split(','));
  }

  private extractExcelFileContent(fileData: Uint8Array): string[][] {
    const workbook = XLSX.read(fileData, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: true});

    const nonEmptyRows = rows.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
    return nonEmptyRows;
  }

  // create form from content. First row represents headers
  private createFormFromContent(content: string[][], requiredValues: string[]): FormGroup {
    const form = new FormGroup({});
    const headers = content[0];

    headers.forEach(header => {
      form.addControl(header, new FormControl(''));
    });

    for (let i = 1; i < content.length; i++) {
      const row = content[i];
      const rowForm = new FormGroup({});

      for (let j = 0; j < row.length; j++) {
        const header = headers[j];
        rowForm.addControl(header, new FormControl(row[j]));
      }

      this.content.push(rowForm);
    }

    return form;

    

  }

}
