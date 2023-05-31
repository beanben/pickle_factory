import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UnitService } from 'src/app/_services/unit/unit.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-step-four',
  templateUrl: './upload-step-four.component.html',
  styleUrls: ['./upload-step-four.component.css']
})
export class UploadStepFourComponent implements OnInit, OnDestroy {
  @Input() data = {} as Uint8Array;
  dataForm = {} as FormGroup;
  fileName = '';
  subs: Subscription[] = [];
  headers: string[] = [];

  constructor(private _unitService: UnitService) {}

  ngOnInit(): void {
    this.subs.push(
      this._unitService.getFileNameSub().subscribe(fileName => {
        this.fileName = fileName;
      })
    );

    this.onFileUploaded();
  }

  onFileUploaded(){
    
    this.headers = this.extractFileContent(this.data, this.fileName, true) as string[];
    const content = this.extractFileContent(this.data, this.fileName);

    
    // this.dataForm = this.createFormFromData(content);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private extractFileContent(fileData: Uint8Array, fileName: string, headersOnly = false): string[][] | string[] {
    let content: string[][] = [];

    if (fileName.endsWith('.csv')) {
      content = this.extractCSVFileContent(fileData);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      content = this.extractExcelFileContent(fileData);
    }

    if (headersOnly) {
      return content[0];  // Only return the first row (headers)
    } else {
      return content;
    }
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

  private createFormFromData(data: string[][]): FormGroup {
    let form = new FormGroup({
      rows: new FormArray([])
    });

    let headers = data[0].map(header => header.trim());


    for (let i = 1; i < data.length; i++) {
      let row = data[i];

      let rowGroup = new FormGroup({});
      for (let j = 0; j < headers.length; j++) {
        rowGroup.addControl(headers[j], new FormControl(row[j]));
      }
      (form.get('rows') as FormArray).push(rowGroup);
    }

    return form;
  }
}
