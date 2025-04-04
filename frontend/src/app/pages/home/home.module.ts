import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from 'src/app/app-routing.module';




@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
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
