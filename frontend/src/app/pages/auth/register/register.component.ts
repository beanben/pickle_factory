import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { Firm } from '../firm';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  openPopup = false;
  firms : Firm[] = []
  next = false;
  user = {} as User;
  isLogin = false;
  @Output() onLogin = new EventEmitter<boolean>();

  constructor(
    private _authService: AuthService,
    private el: ElementRef,
    ) { 
  }

  ngOnInit(): void {
    this.getFirms();
  }

  closePopup(){
    this.openPopup = false;
    this.getFirms();
  }
  getFirms(){
    this._authService.getFirms()
      .subscribe(firms => this.firms = firms)
  }

  onOpenPopup(){
    this.openPopup = true;
  }
  onNext(){
    this.next = true;
  }
  onLoginPage(){
    this.isLogin = true;
    this.onLogin.emit(true);
  }

}
