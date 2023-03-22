import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { NavLeftComponent } from './nav-left/nav-left.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  declarations: [
    ProfileComponent,
    NavLeftComponent
  ],
  exports: [
    ProfileComponent,
    NavLeftComponent
  ],
})
export class PartsModule { }
