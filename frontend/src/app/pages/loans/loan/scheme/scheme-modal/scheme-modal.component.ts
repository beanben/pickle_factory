import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Choice } from 'src/app/shared/shared';
import { LoanService } from 'src/app/_services/loan/loan.service';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Loan } from '../../loan';
import { Scheme } from '../scheme';

@Component({
  selector: 'app-scheme-modal',
  templateUrl: './scheme-modal.component.html',
  styleUrls: ['./scheme-modal.component.css']
})
export class SchemeModalComponent implements OnInit, OnDestroy {
  displayStyle = "block";
  errors: string[] = [];
  // systemChoices =[
  //   {value: "SQFT", display: "imperial (sqft)"},
  //   {value: "SQM", display: "metric (sqm)"}
  // ];
  systemTypes: Choice[] = [];


  @Output() modalSaveScheme = new EventEmitter<void>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  @Input() scheme = {} as Scheme;
  @Input() mode = "";
  @Input() index = -1;

  sub = Subscription.EMPTY;
  loan = {} as Loan;

  // currencyChoices =[
  //   {value: "GBP", display: "GBP (£)"},
  //   {value: "EUR", display: "EUR (€)"},
  //   {value: "USD", display: "USD ($)"},
  // ];


  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    streetName: [''],
    postcode: [''],
    city: ['', Validators.required],
    country: [''],
    system: ['SQFT', Validators.required]
  });
  get name(){
    return this.form.get('name')
  };
  get city(){
    return this.form.get('city')
  };

  constructor(
    private fb: FormBuilder,
    private _schemeService: SchemeService,
    private el: ElementRef,
    private _loanService: LoanService,
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();
    this.initForm();
    this.getSystemTypes();

    this.sub = this._loanService.getLoanSub()
      .subscribe(loan => this.loan = loan)
  }

  onCancel(){
    this.modalSaveScheme.emit();
  };

  onSave(){
    if(this.form.valid){
      let scheme: Scheme = this.form.value;
      scheme.loanId = this.loan.id;

      if(this.scheme.id) {
        scheme.id = this.scheme.id;
        this._schemeService.updateScheme(scheme)
        .then((result) => {
          let scheme: Scheme = result.response;
          this.loan.schemes[this.index]=scheme;
          this.modalSaveScheme.emit();
        })
        .catch(err => this.errors = err)


      } else {
        this._schemeService.createScheme(scheme)
        .then((result) => {
          let scheme: Scheme = result.response;
          this.loan.schemes.push(scheme);
          this.modalSaveScheme.emit();
        })
        .catch(err => this.errors = err)

      };
    }
  };

  initForm(){
    if(this.scheme.id){
      this.form.setValue({
        'name': this.scheme.name,
        'streetName': this.scheme.streetName,
        'postcode': this.scheme.postcode,
        'city': this.scheme.city,
        'country': this.scheme.country,
        'system': this.scheme.system,
      })
    }
  }

  onConfirmDelete(){
    this._schemeService.deleteScheme(this.scheme)
      .subscribe(() =>  this.deleteIsConfirmed.emit())
  }

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
    }
    });
  };

  getSystemTypes(){
    this._schemeService.getSystemTypes()
      .subscribe((systemTypes: Choice[]) => {
        this.systemTypes = systemTypes;
      })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
