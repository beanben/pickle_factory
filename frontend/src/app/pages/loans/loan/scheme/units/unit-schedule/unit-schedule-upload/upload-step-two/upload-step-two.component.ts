import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UnitService} from 'src/app/_services/unit/unit.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-step-two',
  templateUrl: './upload-step-two.component.html',
  styleUrls: ['./upload-step-two.component.css']
})
export class UploadStepTwoComponent implements OnInit, OnDestroy {
  errorMessage = '';
  @Output() contentUpload = new EventEmitter<string[][]>();
  dataForm = {} as FormGroup;
  fileName = '';
  subs: Subscription[] = [];
  data = {} as Uint8Array;
  headers: string[] = [];
  parametresRequired: string[] = [];
  content: string[][] = [];
  
  constructor(private _unitService: UnitService) {}

  ngOnInit(): void {
    this.subs.push(
      this._unitService.getFileSub().subscribe(file => {
        if (file instanceof File) {
          this.readFile(file);
        }
      }),
      this._unitService.getParametersRequiredSub().subscribe(parametresRequired => {
        this.parametresRequired = parametresRequired;
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

    this._unitService.setFileSub(file);
    this.readFile(file);
  }

  readFile(file: File) {
    document.getElementById('file-name')!.innerText = file.name || 'Select file to upload';

    const reader = new FileReader();

    reader.onload = () => {
      this.data = new Uint8Array(reader.result as ArrayBuffer);

      this.content = this.extractFileContent(this.data, file.name);
      this.headers = this.content[0];

      if (this.headers.length > 0 && this.arraysAreEqual(this.headers, this.parametresRequired)) {
        this.contentUpload.emit(this.content);
      }
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

    return lines.map(line => line.split(',').map(data => {
      const trimmedData = data.trim();
      return typeof trimmedData === 'string' ? trimmedData.toLowerCase() : trimmedData;
    }));
  }

  private extractExcelFileContent(fileData: Uint8Array): string[][] {
    const workbook = XLSX.read(fileData, {type: 'array', cellDates: true});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: false});

    const nonEmptyRows = rows.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
    const trimmedRows = nonEmptyRows.map(row => row.map(cell => {
      const trimmedCell = typeof cell === 'string' ? cell.trim() : cell;
      return typeof trimmedCell === 'string' ? trimmedCell.toLowerCase() : trimmedCell;
    }));

    return trimmedRows;
  }

  arraysAreEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((value, index) => value.trim().toLowerCase() === arr2[index].trim().toLowerCase());
  }

  stringsAreEqual(str1: string | undefined, str2: string): boolean {
    if (!str1) {
      return false;
    }
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
