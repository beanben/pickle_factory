import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  mode = "new";
  errors: string[] = [];
  scheme = {} as Scheme;

  @Output() modalSaveScheme= new EventEmitter<Scheme|null>();
  @Input() loan = {} as Loan;

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
  ) { }

  ngOnInit(): void {

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

}
