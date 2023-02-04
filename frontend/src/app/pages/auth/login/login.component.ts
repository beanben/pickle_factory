import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errors: string[] = new Array();
  // sub = Subscription.EMPTY;

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
        // console.log("navigate");
        // this.getUser();
      })
       .catch(err => this.errors = err)
    }
 }

//  getUser() {
//   this.sub = this._authService.getUser()
//     .subscribe(user => {
//       console.log("user:", user);
//       this._authService.setUserSub(user);
//     })
//   }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe()
  // }



}
