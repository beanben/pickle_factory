import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  errors: string[] = new Array();
  firm = {} as Firm;

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
    passwordConfirm: ['', Validators.required]
  })

  get email(){
    return this.userForm.get('email')
  }
  get password(){
    return this.userForm.get('password')
  }
  get passwordConfirm(){
    return this.userForm.get('passwordConfirm')
  }

  constructor(
    private _authService: AuthService,
    private router: Router,
    private fb: FormBuilder
    ) { 
  }

  ngOnInit(): void { 
  }

  onCreateFirm(){
    if(this.firmForm.valid){
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
  }

  onCreateUser() {
    if(this.userForm.valid){
      let user: User = this.userForm.value;
      this._authService.register(user)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => this.errors = err)
    }
 }
}
