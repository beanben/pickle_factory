import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-upload-nav',
  templateUrl: './upload-nav.component.html',
  styleUrls: ['./upload-nav.component.css']
})
export class UploadNavComponent implements OnInit, OnChanges {
  chevronRight = 'assets/images/chevronRight.svg';

  selectFileStatus = 'active';
  dataValidationStatus = 'inactive';
  uploadStatus = 'inactive';
  @Input() step = 1;

  constructor() { }

  ngOnInit(): void {
    this.updateStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["step"]) {
      this.updateStatus();
    }
  }

  updateStatus() {
    if (this.step === 1 || this.step === 2) {
      this.selectFileStatus = 'active';
      this.dataValidationStatus = 'inactive';
      this.uploadStatus = 'inactive';
    } else if (this.step === 3 || this.step === 4) {
      this.selectFileStatus = 'complete';
      this.dataValidationStatus = 'active';
      this.uploadStatus = 'inactive';
    } else {
      this.selectFileStatus = 'complete';
      this.dataValidationStatus = 'complete';
      this.uploadStatus = 'active';
    }
  }

}
