import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavLeftComponent } from './parts/nav-left/nav-left.component';
import { ProfileComponent } from './parts/profile.component';
import { authInterceptorProviders } from './_services/auth/auth.interceptor';
import { LandingComponent } from './pages/home/landing.component';
import { RequiredComponent } from './parts/required.component';
import { InitialPipe } from './parts/initials.pipe';
import { LoanComponent } from './pages/loan/loan.component';
import { NewLoanComponent } from './pages/loan/new-loan/new-loan.component';

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
    NavLeftComponent,
    ProfileComponent,
    RequiredComponent,
    InitialPipe,
    LoanComponent,
    NewLoanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ {provide: APP_BASE_HREF, useValue: '/'}, authInterceptorProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
