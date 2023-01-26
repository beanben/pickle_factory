import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
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

  @Output() modalSaveScheme = new EventEmitter<Scheme|null>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  @Input() scheme = {} as Scheme;
  @Input() mode = "";

  sub = Subscription.EMPTY;
  loan = {} as Loan;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    street_name: [''],
    postcode: [''],
    city: ['', Validators.required],
    country: [''],
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
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.sub = this._loanService.getLoanSub()
      .subscribe(loan => this.loan = loan)
  }

  onCancel(){
    this.modalSaveScheme.emit(null);
  };

  onSave(){
    if(this.form.valid){
      let scheme: Scheme = this.form.value;
      scheme.loan_id = this.loan.id;

      if(this.scheme.id) {
        scheme.id = this.scheme.id;
        var req = this._schemeService.updateScheme(scheme)

      } else {
        var req = this._schemeService.createScheme(scheme)
      };

      req.then((result) => {
          let scheme: Scheme = result.response;
          
          // add scheme to loan in behaviorsubject
          this.loan.schemes.push(scheme);
          this._loanService.setLoanSub(this.loan);

          this.modalSaveScheme.emit(scheme);
        })
        .catch(err => this.errors = err)
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
          this.onCancel();
    });
  };

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
