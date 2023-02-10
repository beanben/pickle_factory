import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  errors: string[] = new Array();
  successMsg = '';
  form = new FormGroup({
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });
  get password(){
    return this.form.get('password')
  }
  get passwordConfirm(){
    return this.form.get('passwordConfirm')
  }

  constructor(
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
    ) { 
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      let password = this.password?.value;
      let password_confirm = this.passwordConfirm?.value;
      let token = this.route.snapshot.params['token']

      this._authService
      .reset(password, password_confirm, token)
      .then(() => this.router.navigate(['/auth/login']))
      .catch(err => this.errors = err)
    }
  }

}
