import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    LandingComponent,
    HomeComponent
  ],
  exports: [
    LandingComponent,
    HomeComponent
  ]
})
export class HomeModule { }
