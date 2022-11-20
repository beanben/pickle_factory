import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errors: string[] = new Array();

  constructor(
    private router: Router,
    private _authService: AuthService,
    ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this._authService.login(email, password)
     .then(() => this.router.navigate(['/']))
     .catch(err => this.errors = err)
 }

}
