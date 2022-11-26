import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  constructor(
    private _authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
    ) { 
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const password = form.value.password;
    const password_confirm = form.value.password_confirm;
    const token = this.route.snapshot.params['token']

    this._authService.reset(password, password_confirm, token)
     .then(() => this.router.navigate(['/auth/login']))
     .catch(err => this.errors = err)
 }

}
