import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Loan } from 'src/app/_interfaces/loan.interface';
import { Scheme } from 'src/app/_interfaces/scheme.interface';
import { Choice } from 'src/app/_interfaces/shared.interface';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';


@Component({
  selector: 'app-scheme-modal',
  templateUrl: './scheme-modal.component.html'
})
export class SchemeModalComponent implements OnInit, OnDestroy {
  displayStyle = "block";
  errors: string[] = [];
  systemTypes: Choice[] = [];

  @Output() modalSaveScheme = new EventEmitter<Scheme | null>();
  @Output() deleteIsConfirmed = new EventEmitter<Scheme>()
  @Input() scheme = {} as Scheme;
  @Input() mode = "";
  // @Input() index = -1;
  @Input() loan = {} as Loan;

  sub = Subscription.EMPTY;
  // loan = {} as Loan;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    streetName: [''],
    postcode: [''],
    city: ['', Validators.required],
    country: [''],
    system: ['', Validators.required],
    isBuilt: [false]
  });
  get name() {
    return this.form.get('name')
  };
  get city() {
    return this.form.get('city')
  };

  constructor(
    private fb: FormBuilder,
    private _schemeService: SchemeService,
    private el: ElementRef,
    //   private _loanService: LoanService,
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();
    this.getChoices("system");
    this.initForm();


    // this.sub = this._loanService.getLoanSub()
    //   .subscribe(loan => this.loan = loan)
  }

  onCancel() {
    this.modalSaveScheme.emit();
  };

  onSave() {
    if (!this.form.valid) {
      return;
    };

    let scheme: Scheme = this.formToScheme(this.form);

    if (this.scheme.id) {
      scheme.id = this.scheme.id;
      this._schemeService.updateScheme(scheme)
        .then((result) => {
          let scheme: Scheme = result.response;
          this.modalSaveScheme.emit(scheme);
        })
        .catch(err => this.errors = err)


    } else {
      this._schemeService.createScheme(scheme)
        .then((result) => {
          let scheme: Scheme = result.response;
          // this.loan.schemes.push(scheme);
          this.modalSaveScheme.emit(scheme);
        })
        .catch(err => this.errors = err)

    };
  };

  formToScheme(form: FormGroup): Scheme {
    const scheme: Scheme = form.value;
    scheme.loanId = this.loan.id;
    return scheme;
  };


  initForm() {
    if (!this.scheme.id) {
      return
    };

    this.form.setValue({
      'name': this.scheme.name,
      'streetName': this.scheme.streetName,
      'postcode': this.scheme.postcode,
      'city': this.scheme.city,
      'country': this.scheme.country,
      'system': this.scheme.system,
      'isBuilt': this.scheme.isBuilt
    })

  }

  onConfirmDelete() {
    this._schemeService.deleteScheme(this.scheme)
      .subscribe(() => this.deleteIsConfirmed.emit(this.scheme))
  }

  onCancelDelete(){
    this.mode = "edit";
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  getChoices(choiceType: string) {
    this._schemeService.getChoices(choiceType)
      .subscribe((systemTypes: Choice[]) => {
        this.systemTypes = systemTypes;
        this.form.patchValue({ system: systemTypes[0].value })
      })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
