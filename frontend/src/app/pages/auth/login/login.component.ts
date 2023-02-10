import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errors: string[] = new Array();

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  get email(){
    return this.form.get('email')
  }
  get password(){
    return this.form.get('password')
  }

  constructor(
    private router: Router,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      let email = this.email?.value;
      let password = this.password?.value;
  
      this._authService.login(email, password)
       .then(() => {
        this.router.navigate(['/']);
      })
       .catch(err => this.errors = err)
    }
 }

}
