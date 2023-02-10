import { Component, Input, OnInit } from '@angular/core';
import { Scheme } from '../scheme';
import { Unit } from './unit';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  openUnitModal = false;
  modalMode = "";

  @Input() scheme = {} as Scheme

  constructor() { }

  ngOnInit(): void {
  }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(units: Unit[] | null){
    this.openUnitModal = false;

    if(units){
      this.scheme.units = units;
    }
  }

}
