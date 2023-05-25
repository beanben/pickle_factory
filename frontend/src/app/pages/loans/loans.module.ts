import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoansComponent } from './loans.component';
import { LoanComponent } from './loan/loan.component';
import { SchemeComponent } from './loan/scheme/scheme.component';
import { SchemeModalComponent } from './loan/scheme/scheme-modal/scheme-modal.component';
import { FundersComponent } from './loan/funders/funders.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoanModalComponent } from './loan/loan-modal/loan-modal.component';
import { PartsModule } from 'src/app/parts/parts.module';
import { UnitsComponent } from './loan/scheme/units/units.component';
import { AssetClassModalComponent } from './loan/scheme/units/asset-class-modal/asset-class-modal.component';
import { UnitCardComponent } from './loan/scheme/units/unit-card/unit-card.component';
import { UnitScheduleComponent } from './loan/scheme/units/unit-schedule/unit-schedule.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UnitScheduleUploadComponent } from './loan/scheme/units/unit-schedule/unit-schedule-upload/unit-schedule-upload.component';
import { UnitScheduleModalComponent } from './loan/scheme/units/unit-schedule/unit-schedule-modal/unit-schedule-modal.component';
import { UploadNavComponent } from './loan/scheme/units/unit-schedule/unit-schedule-upload/upload-nav/upload-nav.component';
import { UploadStepOneComponent } from './loan/scheme/units/unit-schedule/unit-schedule-upload/upload-step-one/upload-step-one.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PartsModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    LoansComponent,
    LoanComponent,
    LoanModalComponent,
    FundersComponent,
    SchemeComponent,
    SchemeModalComponent,
    UnitsComponent,
    AssetClassModalComponent,
    UnitCardComponent,
    UnitScheduleModalComponent,
    UnitScheduleComponent,
    UnitScheduleUploadComponent,
    UploadNavComponent,
    UploadStepOneComponent,
  ],
  exports: [

  ]
})
export class LoansModule { }
