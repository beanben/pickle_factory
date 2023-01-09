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
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NavLeftComponent } from './parts/nav-left/nav-left.component';
import { ProfileComponent } from './parts/profile.component';
import { authInterceptorProviders } from './_services/auth/auth.interceptor';
import { LandingComponent } from './pages/home/landing.component';
import { RequiredComponent } from './parts/required.component';
import { InitialPipe } from './shared/initial.pipe';
import { LoanComponent } from './pages/loan/loan.component';
import { LoanModalComponent } from './pages/loan/loan-modal/loan-modal.component';
import { EditComponent } from './shared/edit.component';
import { InitialsPipe } from './shared/initials.pipe';
import { LoanDetailsComponent } from './pages/loan/loan-details/loan-details.component';
import { StakeholdersComponent } from './pages/loan/stakeholders/stakeholders.component';
import { BorrowerComponent } from './pages/borrower/borrower.component';
import { BorrowerModalComponent } from './pages/borrower/borrower-modal/borrower-modal.component';
import { BorrowerLoansComponent } from './pages/borrower/borrower-loans/borrower-loans.component';
import { DeleteComponent } from './shared/delete.component';
import { SchemeComponent } from './pages/scheme/scheme.component';
import { SchemeModalComponent } from './pages/scheme/scheme-modal/scheme-modal.component';

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
    LoanModalComponent,
    EditComponent,
    InitialsPipe,
    LoanDetailsComponent,
    StakeholdersComponent,
    BorrowerComponent,
    BorrowerModalComponent,
    BorrowerLoansComponent,
    DeleteComponent,
    SchemeComponent,
    SchemeModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' }),
  ],
  providers: [ {provide: APP_BASE_HREF, useValue: '/'}, authInterceptorProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
