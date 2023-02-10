import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  errors: string[] = new Array();
  successMsg = '';
  form = new FormGroup({
    email: new FormControl('', Validators.required)
  });
  get email(){
    return this.form.get('email')
  };

  constructor(
    private _authService: AuthService,
    ) { 
  }

  ngOnInit(): void {
  }

onSubmit() {
  if (this.form.valid) {
    let email = this.email?.value;

    this._authService.forgot(email)
    .then(() => this.successMsg = 'Email sent!')
    .catch(err => this.errors = err)
  }
}

}
