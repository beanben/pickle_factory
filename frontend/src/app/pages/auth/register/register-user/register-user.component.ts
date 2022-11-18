import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { User } from '../../user';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  errors: string[] = new Array();
  @Input() user = {} as User;

  constructor(
    private router: Router,
    private _authService: AuthService
    ) { 
  }

  ngOnInit(): void {
    }

  onSubmit() {
    // this._authService.register(this.user)
    // .then(() => {
    //   this.router.navigate(['/']);
    // })
    // .catch(err => this.errors = err)
 }

}
