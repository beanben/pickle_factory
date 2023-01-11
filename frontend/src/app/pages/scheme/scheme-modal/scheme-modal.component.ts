import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Loan } from '../../loan/loan';
import { Scheme } from '../scheme';

@Component({
  selector: 'app-scheme-modal',
  templateUrl: './scheme-modal.component.html',
  styleUrls: ['./scheme-modal.component.css']
})
export class SchemeModalComponent implements OnInit {
  displayStyle = "block";
  errors: string[] = [];
  mode = "";

  @Output() modalSaveScheme = new EventEmitter<Scheme|null>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  @Input() loan = {} as Loan;
  @Input() scheme = {} as Scheme;

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
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.getMode();
    this.initForm()
  }

  onCancel(){
    this.modalSaveScheme.emit(null);
  };

  onSave(){
    if(this.form.valid){
      this.scheme = this.form.value;
      this.scheme.loan_id = this.loan.id;

      if(this.scheme.id) {
        var req = this._schemeService.updateScheme(this.scheme)
      } else {
        var req = this._schemeService.createScheme(this.scheme)
      };

      req.then((result) => {
          let scheme: Scheme = result.response;
          this.modalSaveScheme.emit(scheme);
        })
        .catch(err => this.errors = err)
    }
  };

  getMode(){
    if(this.scheme.id){
      this.mode = "edit";
    } else {
      this.mode = "new"
    }
  }

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

}
