import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  @Output() modalSaveScheme = new EventEmitter<void>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  @Input() scheme = {} as Scheme;
  @Input() mode = "";
  @Input() index = -1;

  sub = Subscription.EMPTY;
  loan = {} as Loan;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    street_name: [''],
    postcode: [''],
    city: ['', Validators.required],
    country: [''],
    currency: ['', Validators.required],
    system: ['', Validators.required]
  });
  get name(){
    return this.form.get('name')
  };
  get city(){
    return this.form.get('city')
  };
  get currency(){
    return this.form.get('currency')
  };
  get system(){
    return this.form.get('system')
  };

  currency_choices =[
    {value: "GBP", display: "GBP (£)"},
    {value: "EUR", display: "EUR (€)"},
    {value: "USD", display: "USD ($)"},
  ];
  system_choices =[
    {value: "SQFT", display: "imperial (sqft)"},
    {value: "SQM", display: "metric (sqm)"}
  ];

  constructor(
    private fb: FormBuilder,
    private _schemeService: SchemeService,
    private el: ElementRef,
    private _loanService: LoanService,
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();
    this.initForm();

    this.sub = this._loanService.getLoanSub()
      .subscribe(loan => this.loan = loan)
  }

  onCancel(){
    this.modalSaveScheme.emit();
  };

  onSave(){
    if(this.form.valid){
      let scheme: Scheme = this.form.value;
      scheme.loan_id = this.loan.id;

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
        'street_name': this.scheme.street_name,
        'postcode': this.scheme.postcode,
        'city': this.scheme.city,
        'country': this.scheme.country,
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

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
