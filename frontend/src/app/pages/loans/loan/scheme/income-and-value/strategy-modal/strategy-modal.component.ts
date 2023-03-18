import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AssetClassType } from '../../scheme.model';

@Component({
  selector: 'app-strategy-modal',
  templateUrl: './strategy-modal.component.html',
  styleUrls: ['./strategy-modal.component.css']
})
export class StrategyModalComponent implements OnInit {
  displayStyle = "block";
  @Input() assetClass = {} as AssetClassType;
  @Input() mode = "";
  @Output() modalSaveStrategy = new EventEmitter();

  form: FormGroup = new FormGroup({
    investmentStrategy: new FormControl('buildToSell'),
  })
  constructor(
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  onCancel() {
    this.modalSaveStrategy.emit();
  };

  onSave(){
    const investmentStrategy: string = this.form.value;
    console.log("investmentStrategy: ", investmentStrategy);
  }

}
