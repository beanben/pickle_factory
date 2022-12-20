import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './_services/auth/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  // {path: '', component: LandingComponent},
  {path: 'auth', component: AuthComponent, children: [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'forgot', component: ForgotComponent},
    {path: 'reset/:token', component: ResetComponent},  
  ]},
  { path: '**', redirectTo: "/"}
  // {path: 'home', component: HomeComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
