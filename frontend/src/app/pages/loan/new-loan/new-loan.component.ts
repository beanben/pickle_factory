import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css']
})
export class NewLoanComponent implements OnInit {
  displayStyle = "block";
  @Output() onClosePopup = new EventEmitter<void>();
  form = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  get name(){
    return this.form.get('name')
  };

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {  
  }

  closePopup() {
    this.displayStyle = "none"; 
    this.onClosePopup.emit();
  }

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.closePopup();
      }
    });
  }

}
