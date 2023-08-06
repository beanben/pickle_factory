import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowersComponent } from './borrowers.component';
import { BorrowerComponent } from './borrower/borrower.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PartsModule } from 'src/app/parts/parts.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BorrowersComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PartsModule
  ],
  declarations: [
    BorrowersComponent,
    BorrowerComponent,
  ],
  exports: [
    // BorrowersComponent,
    // BorrowerComponent,
  ]
})
export class BorrowersModule { }
