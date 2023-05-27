import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaseStructure, UnitScheduleData, UnitStructure } from 'src/app/_interfaces/scheme.interface';
import { Choice } from 'src/app/_interfaces/shared.interface';
import { AssetClassType } from 'src/app/_types/custom.type';

@Component({
  selector: 'app-unit-schedule-upload',
  templateUrl: './unit-schedule-upload.component.html',
  // styleUrls: ['./unit-schedule-upload.component.css']
})
export class UnitScheduleUploadComponent implements OnInit {
  displayStyle = 'block';
  // information = 'assets/images/information.svg';
  isChecked = false;
  
  selectFileStatus = 'active';
  dataValidationStatus = 'inactive';
  uploadStatus = 'inactive';
  step = 1;
  // nextIsClicked = false;
  @Output() modalUploadUnitSchedule = new EventEmitter<UnitScheduleData[] | null>();
  // dataParametre: string[] = [];
  @Input() unitStructure = {} as UnitStructure;
  @Input() leaseStructure = {} as LeaseStructure;
  @Input() assetClass = {} as AssetClassType;
  @Input() ownershipTypeChoices: Choice[] = [];
  @Input() leaseTypeChoices: Choice[] = [];
  @Input() saleStatusChoices: Choice[] = [];
  // private parametresSubject = new BehaviorSubject<string[]>([]);
  // parametres$: Observable<string[]> = this.parametresSubject.asObservable();

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();
    // const parametres = this.getParametres();
    // this.parametresSubject.next(parametres);
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
  }

  onNext() {
    // this.nextIsClicked = true;
    this.step += 1;
  }

  onPrevious() {
    // this.nextIsClicked = false;
    this.step--;
  }

  // getParametres(): string[]{
  //   const parameters: string[] = [];

  //   const unitParametre = this.unitParametre();
  //   if(this.assetClass.investmentStrategy === 'buildToSell'){
  //     const saleParametre = this.saleParametre();
  //     parameters.push(...unitParametre, ...saleParametre);

  //   }else{
  //     const leaseParametre = this.leaseParametre();
  //     parameters.push(...unitParametre, ...leaseParametre);
  //   }

  //   return parameters;
  // }

  // unitParametre(): string[] {
  //   const unitParametre: string[] = [];
  //   unitParametre.push(
  //     this.unitStructure.label + ' identifier',
  //     'description',
  //     this.unitStructure.areaType + ' (' + this.unitStructure.areaSystem + ')'
  //   );
  //   if(this.unitStructure.hasBeds){
  //     unitParametre.push('beds');
  //   }
  //   return unitParametre
  // }

  // saleParametre(): string[] {
  //   const saleParametre: string[] = [];

  //   saleParametre.push(
  //     'ownership type',
  //     'target price',
  //     'price achieved',
  //     'sale status',
  //     'sale status date',
  //     'buyer',
  //   )

  //   return saleParametre
  // }

  // leaseParametre(): string[] {
  //   const leaseParametre: string[] = [];

  //   let frequency = '';
  //   if(this.leaseStructure.rentFrequency === 'perWeek'){
  //     frequency = 'per week';
  //   }else{
  //     frequency = 'per month';
  //   }

  //   leaseParametre.push(
  //     'lease type',
  //     'rent target' + ' (' + frequency + ')',
  //     'rent achieved' + ' (' + frequency + ')',
  //     'lease start date',
  //     'lease end date',
  //     'tenant',
  //   )

  //   return leaseParametre
  // }

  // getLetter(index: number): string{
  //   return String.fromCharCode(65 + index);
  // }

  onCheckboxChanged(isChecked: boolean){
    this.isChecked = isChecked;
  }



}
