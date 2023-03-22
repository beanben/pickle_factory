import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    // SharedModule
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
