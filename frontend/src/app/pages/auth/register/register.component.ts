import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firm, User } from 'src/app/_interfaces/auth.interface';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.css']
})
export class RegisterComponent implements OnInit {
  formIsSubmitted = false
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
    this.formIsSubmitted = true;

    if(this.firmForm.valid){
      this.formIsSubmitted = false; 

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
    this.formIsSubmitted = true; 
    
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
