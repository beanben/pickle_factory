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
import { StrategyModalComponent } from './loan/scheme/units/strategy-modal/strategy-modal.component';
// import { SalesScheduleComponent } from './loan/scheme/units/sales-schedule/sales-schedule.component';
import { UnitScheduleModalComponent } from './loan/scheme/units/unit-schedule-modal/unit-schedule-modal.component';
import { UnitScheduleComponent } from './loan/scheme/units/unit-schedule/unit-schedule.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PartsModule,

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
    StrategyModalComponent,
    UnitScheduleModalComponent,
    UnitScheduleComponent
  ],
  exports: [
    // LoansComponent,
    // LoanComponent,
    // LoanModalComponent,
    // FundersComponent,
    // SchemeComponent,
    // SchemeModalComponent,
    // UnitsComponent,
    // AssetClassModalComponent,
    // UnitCardComponent,
    // StrategyModalComponent,
    // UnitScheduleModalComponent,
    // UnitScheduleComponent
  ]
})
export class LoansModule { }
