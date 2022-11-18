import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { Firm } from '../../firm';

@Component({
  selector: 'app-register-firm',
  templateUrl: './register-firm.component.html',
  styleUrls: ['./register-firm.component.css']
})
export class RegisterFirmComponent implements OnInit {
  displayStyle = "block";
  @Output() onClosePopup = new EventEmitter<void>();
  firm = {} as Firm;
  

  constructor(
    private el: ElementRef,
    private _authService: AuthService
  ) { 
    this.addEventBackgroundClose();
  }

  ngOnInit(): void {
  }

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.closePopup();
      }
    });
  }

  closePopup() {
    this.displayStyle = "none"; 
    this.onClosePopup.emit();
  }

  onClick(){
    console.log("clicked");
    this._authService.createFirm(this.firm)
      .subscribe(() => this.closePopup())
  }

}
