import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Property } from '../property';

@Component({
  selector: 'app-property-modal',
  templateUrl: './property-modal.component.html',
  styleUrls: ['./property-modal.component.css']
})
export class PropertyModalComponent implements OnInit {
  displayStyle = "block";
  mode = "new";
  errors: string[] = [];
  property = {} as Property;

  @Output() modalSaveProperty = new EventEmitter<Property|null>();
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
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onCancel(){
    this.modalSaveProperty.emit(null);
  };

  onSave(){
    if(this.form.valid){
      this.property = this.form.value;
      console.log("this.property:", this.property)
    }
  }

}
