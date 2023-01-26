import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Scheme } from './scheme';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit{
  openSchemeModal = false;
  modalMode = "";
  tabActive = "units";

  @Input() scheme = {} as Scheme;
  @Input() index = -1;
  @Output() deleteConfirmed = new EventEmitter<number>();

  constructor( ) { }

  ngOnInit(): void { }

  onOpenModal(modalMode: string){
    this.openSchemeModal = true;
    this.modalMode = modalMode;
  }

  onSave(scheme: Scheme | null){
    this.openSchemeModal = false;

    if(scheme){
      this.scheme = scheme;
    }  
  }

  onDeleteScheme(){
    this.openSchemeModal = false;
    this.deleteConfirmed.emit(this.index);
  }
  

}
