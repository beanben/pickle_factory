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
import { LoanComponent } from './pages/loans/loan/loan.component';
import { LoanModalComponent } from './pages/loans/loan/loan-modal/loan-modal.component';
import { EditComponent } from './shared/edit.component';
import { ToggleComponent } from './shared/toggle.component';
import { InitialsPipe } from './shared/initials.pipe';
import { FundersComponent } from './pages/loans/loan/funders/funders.component';
import { BorrowerComponent } from './pages/borrowers/borrower/borrower.component';
import { BorrowerModalComponent } from './pages/borrowers/borrower/borrower-modal/borrower-modal.component';
import { DeleteComponent } from './shared/delete.component';
import { LoansComponent } from './pages/loans/loans.component';
import { BorrowersComponent } from './pages/borrowers/borrowers.component';
import { SchemeComponent } from './pages/loans/loan/scheme/scheme.component';
import { SchemeModalComponent } from './pages/loans/loan/scheme/scheme-modal/scheme-modal.component';
import { UnitsComponent } from './pages/loans/loan/scheme/units/units.component';
import { UnitModalComponent } from './pages/loans/loan/scheme/units/unit-modal/unit-modal.component';
import { DotDirective } from './shared/shared.directive';
import { UnitCardComponent } from './pages/loans/loan/scheme/units/unit-card/unit-card.component';
import { IncomeAndValueComponent } from './pages/loans/loan/scheme/income-and-value/income-and-value.component';
// import { ResidentialComponent } from '../../../draft/residential/residential.component';
import { StrategyModalComponent } from './pages/loans/loan/scheme/income-and-value/strategy-modal/strategy-modal.component';
import { SalesScheduleComponent } from './pages/loans/loan/scheme/income-and-value/sales-schedule/sales-schedule.component';

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
    FundersComponent,
    BorrowerComponent,
    BorrowerModalComponent,
    DeleteComponent,
    SchemeComponent,
    SchemeModalComponent,
    LoansComponent,
    BorrowersComponent,
    UnitsComponent,
    UnitModalComponent,
    DotDirective,
    UnitCardComponent,
    IncomeAndValueComponent,
    // ResidentialComponent,
    StrategyModalComponent,
    SalesScheduleComponent,
    ToggleComponent
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
