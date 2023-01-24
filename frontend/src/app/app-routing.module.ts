import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { BorrowerComponent } from './pages/borrowers/borrower/borrower.component';
import { BorrowersComponent } from './pages/borrowers/borrowers.component';
import { HomeComponent } from './pages/home/home.component';
import { LoanComponent } from './pages/loans/loan/loan.component';
import { LoansComponent } from './pages/loans/loans.component';
import { AuthGuard } from './_services/auth/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auth', component: AuthComponent, children: [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'forgot', component: ForgotComponent},
    {path: 'reset/:token', component: ResetComponent},  
  ]},
  // {path: 'loans', component: LoansComponent, canActivate: [AuthGuard], children: [
  //   {path: ':slug', component: LoanComponent}
  // ]},
  {path: 'loans', component: LoansComponent, canActivate: [AuthGuard]},
  {path: 'borrowers', component: BorrowersComponent, canActivate: [AuthGuard]},
  // {path: 'borrowers', component: BorrowersComponent, canActivate: [AuthGuard], children: [
  //   {path: ':slug', component: BorrowerComponent}
  // ]},
  { path: '**', redirectTo: "/"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
