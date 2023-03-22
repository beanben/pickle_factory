import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowersComponent } from './borrowers.component';
import { BorrowerComponent } from './borrower/borrower.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { BorrowerModalComponent } from '../../shared/borrower-modal/borrower-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    BorrowersComponent,
    BorrowerComponent,
    // BorrowerModalComponent,
  ],
  exports: [
    BorrowersComponent,
    BorrowerComponent,
    // BorrowerModalComponent,
  ]
})
export class BorrowersModule { }
