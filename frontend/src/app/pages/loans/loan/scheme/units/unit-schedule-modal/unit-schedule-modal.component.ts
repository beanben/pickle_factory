import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';

@Component({
  selector: 'app-unit-schedule-modal',
  templateUrl: './unit-schedule-modal.component.html',
  styleUrls: ['./unit-schedule-modal.component.css']
})
export class UnitScheduleModalComponent implements OnInit {
  displayStyle = "block";
  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit;
  @Output() modalSaveUnitSchedule = new EventEmitter<Unit[] | null>();

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void { 
    this.addEventBackgroundClose();
  };

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  onCancel(){
    this.modalSaveUnitSchedule.emit();
  }

}
