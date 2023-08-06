import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { BorrowersComponent } from './pages/borrowers/borrowers.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './_services/auth/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auth', component: AuthComponent, children: [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'forgot', component: ForgotComponent},
    {path: 'reset/:token', component: ResetComponent},  
  ]},
  { path: 'loans', loadChildren: () => import('./pages/loans/loans.module').then(m => m.LoansModule), canActivate: [AuthGuard]},
  { path: 'borrowers', loadChildren: () => import('./pages/borrowers/borrowers.module').then(m => m.BorrowersModule), canActivate: [AuthGuard]},

  // {path: 'borrowers', component: BorrowersComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: "/"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
