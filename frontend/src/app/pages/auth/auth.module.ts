import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ResetComponent } from './reset/reset.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthComponent,
    ResetComponent,
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
  ],
  exports: [
    // AuthComponent,  
    // ResetComponent,
    // RegisterComponent,
    // LoginComponent,
    // ForgotComponent,
  ]
})
export class AuthModule { }
