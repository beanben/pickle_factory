import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  errors: string[] = new Array();
  successMsg = '';

  constructor(
    private _authService: AuthService,
    ) { 
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;

    this._authService.forgot(email)
     .then((result) => {
      this.successMsg = 'Email sent!';
      })
     .catch(err => this.errors = err)
 }

}
