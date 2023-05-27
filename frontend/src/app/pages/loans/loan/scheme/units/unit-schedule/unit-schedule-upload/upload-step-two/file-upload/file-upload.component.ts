import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let fileName = '';
    if (inputElement.files && inputElement.files.length > 0) {
      fileName = inputElement.files[0].name;
    }
    document.getElementById('file-name')!.innerText = fileName || 'Select file to upload';
  }

  onButtonClick() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }
  
}
