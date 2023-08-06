import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { NavLeftComponent } from './nav-left/nav-left.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule
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
