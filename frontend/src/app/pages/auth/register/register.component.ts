import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, tap } from 'rxjs';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { Firm } from '../firm';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  next = false;
  user = {} as User;
  isLogin = false;
  @Output() onLogin = new EventEmitter<boolean>();
  errors: string[] = new Array();
  clicked = false;

  firmForm = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  get name(){
    return this.firmForm.get('name')
  }
  set name(val){
    this.firmForm.get('name')?.setValue(val)
  }
  
  userForm: FormGroup = this.fb.group({
    firm: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    password_confirm: ['', Validators.required]
  })

  get email(){
    return this.userForm.get('email')
  }
  get password(){
    return this.userForm.get('password')
  }
  get password_confirm(){
    return this.userForm.get('password_confirm')
  }

  constructor(
    private _authService: AuthService,
    private el: ElementRef,
    private router: Router,
    private fb: FormBuilder
    ) { 
  }

  ngOnInit(): void { 
  }

  onLoginPage(){
    this.isLogin = true;
    this.onLogin.emit(true);
  }

  onCreateFirm(){
    let firm: Firm = {
      name: this.firmForm.get('name')?.value
    }

    this._authService.createFirm(firm)
    .then((res) => {
      this.next = true;
      this.userForm.get('firm')?.setValue(res.response)
    })
    .catch(err => this.errors = err)
  }

  onCreateUser() {
    let user: User = this.userForm.value;
    this._authService.register(user)
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch(err => this.errors = err)
 }
}
