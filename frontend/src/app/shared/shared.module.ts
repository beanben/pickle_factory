import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotDirective, FormatNumberDirective } from './shared.directive';
import { DeleteComponent } from './delete.component';
import { EditComponent } from './edit.component';
import { InitialsPipe } from './initials.pipe';
import { InitialPipe } from './initial.pipe';
import { RequiredComponent } from './required.component';
import { ToggleComponent } from './toggle.component';
// import { BorrowerModalComponent } from '../pages/borrowers/borrower/borrower-modal/borrower-modal.component';
// import { LoanModalComponent } from './loan-modal/loan-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BorrowerModalComponent } from './borrower-modal/borrower-modal.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    DotDirective,
    DeleteComponent,
    EditComponent,
    RequiredComponent,
    ToggleComponent,
    // LoanModalComponent,
    BorrowerModalComponent,
    InitialsPipe,
    InitialPipe,
    FormatNumberDirective
  ],
  exports: [
    DotDirective,
    DeleteComponent,
    EditComponent,
    RequiredComponent,
    ToggleComponent,
    // LoanModalComponent,
    BorrowerModalComponent,
    InitialsPipe,
    InitialPipe,
    FormatNumberDirective
  ]
})
export class SharedModule { }
