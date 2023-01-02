import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { BorrowerComponent } from './pages/borrower/borrower.component';
import { HomeComponent } from './pages/home/home.component';
import { LoanComponent } from './pages/loan/loan.component';
import { AuthGuard } from './_services/auth/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auth', component: AuthComponent, children: [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'forgot', component: ForgotComponent},
    {path: 'reset/:token', component: ResetComponent},  
  ]},
  {path: 'loan', component: LoanComponent, canActivate: [AuthGuard]},
  {path: 'borrower', component: BorrowerComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: "/"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
