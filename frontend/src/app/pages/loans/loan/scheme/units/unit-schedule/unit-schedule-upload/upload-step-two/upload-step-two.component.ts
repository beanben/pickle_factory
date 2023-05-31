import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UnitService} from 'src/app/_services/unit/unit.service';
// import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-step-two',
  templateUrl: './upload-step-two.component.html',
  styleUrls: ['./upload-step-two.component.css']
})
export class UploadStepTwoComponent implements OnInit, OnDestroy {
  errorMessage = '';
  @Output() dataUpload = new EventEmitter<Uint8Array>();
  dataForm = {} as FormGroup;
  fileName = '';
  subs: Subscription[] = [];
  data = {} as Uint8Array;

  constructor(private _unitService: UnitService) {}

  ngOnInit(): void {
    this.subs.push(
      this._unitService.getFileNameSub().subscribe(fileName => {
        document.getElementById('file-name')!.innerText = fileName;
      })
    );
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = inputElement.files && inputElement.files.length > 0 ? inputElement.files[0] : null;

    if (!file) {
      this.errorMessage = 'file not found';
      return;
    }
    this._unitService.setFileNameSub(file.name);
    document.getElementById('file-name')!.innerText = file.name || 'Select file to upload';

    const reader = new FileReader();

    reader.onload = () => {
      this.data = new Uint8Array(reader.result as ArrayBuffer);
      this.dataUpload.emit(this.data);
    };

    reader.onerror = () => {
      this.errorMessage = 'error reading file';
    };

    reader.readAsArrayBuffer(file);
  }

  onButtonClick() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  // private extractFileContent(fileData: Uint8Array, fileName: string): string[][] {
  //   let content: string[][] = [];

  //   if (fileName.endsWith('.csv')) {
  //     content = this.extractCSVFileContent(fileData);
  //   } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
  //     content = this.extractExcelFileContent(fileData);
  //   }

  //   return content;
  // }

  // private extractCSVFileContent(fileData: Uint8Array): string[][] {
  //   const csvString = new TextDecoder('utf-8').decode(fileData);
  //   const lines = csvString.split('\n').filter(line => line.trim() !== '');

  //   return lines.map(line => line.split(','));
  // }

  // private extractExcelFileContent(fileData: Uint8Array): string[][] {
  //   const workbook = XLSX.read(fileData, {type: 'array'});
  //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: true});

  //   const nonEmptyRows = rows.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
  //   return nonEmptyRows;
  // }

  // private uploadFileToBackend(file: File) {
  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   console.log('formData: ', formData);
  // }

  // checkFormData(formData: FormData) {
  //   formData.forEach((value, key) => {
  //     console.log(`Field name: ${key}`);
  //     console.log(`Field value: ${value}`);
  //   });
  // }

  // private createFormFromData(data: string[][]): FormGroup {
  //   let form = new FormGroup({
  //     rows: new FormArray([])
  //   });

  //   let headers = data[0].map(header => header.trim());


  //   for (let i = 1; i < data.length; i++) {
  //     let row = data[i];

  //     let rowGroup = new FormGroup({});
  //     for (let j = 0; j < headers.length; j++) {
  //       rowGroup.addControl(headers[j], new FormControl(row[j]));
  //     }
  //     (form.get('rows') as FormArray).push(rowGroup);
  //   }

  //   return form;
  // }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());    
  }
}
