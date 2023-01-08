import { Component, OnInit } from '@angular/core';
import { Property } from './property';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  openPropertyModal = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSave(property: Property | null){
    this.openPropertyModal = false
  }

}
