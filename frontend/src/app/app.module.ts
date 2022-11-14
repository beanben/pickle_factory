import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { RegisterUserComponent } from './pages/auth/register/register-user/register-user.component';
import { RegisterFirmComponent } from './pages/auth/register/register-firm/register-firm.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HomeComponent,
    AuthComponent,
    ForgotComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    RegisterUserComponent,
    RegisterFirmComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ {provide: APP_BASE_HREF, useValue: '/'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
