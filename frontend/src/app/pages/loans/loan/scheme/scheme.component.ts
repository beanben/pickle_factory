import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheme } from './scheme';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit{
  openSchemeModal = false;
  modalMode = "";
  tabActive = "incomeAndValue";

  @Input() scheme = {} as Scheme;
  @Input() index = -1;
  @Output() deleteConfirmed = new EventEmitter<number>();

  constructor( 
  ) { }

  ngOnInit(): void {  }

  onOpenModal(modalMode: string){
    this.openSchemeModal = true;
    this.modalMode = modalMode;
  }

  onDeleteScheme(){
    this.openSchemeModal = false;
    this.deleteConfirmed.emit(this.index);
  }
  

}
