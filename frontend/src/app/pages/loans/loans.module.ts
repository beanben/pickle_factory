import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoansComponent } from './loans.component';
import { LoanComponent } from './loan/loan.component';
import { SchemeComponent } from './loan/scheme/scheme.component';
import { UnitsComponent } from './loan/scheme/units/units.component';
import { UnitModalComponent } from './loan/scheme/units/unit-modal/unit-modal.component';
import { UnitCardComponent } from './loan/scheme/units/unit-card/unit-card.component';
import { SchemeModalComponent } from './loan/scheme/scheme-modal/scheme-modal.component';
import { IncomeAndValueComponent } from './loan/scheme/income-and-value/income-and-value.component';
import { StrategyModalComponent } from './loan/scheme/income-and-value/strategy-modal/strategy-modal.component';
import { SalesScheduleComponent } from './loan/scheme/income-and-value/sales-schedule/sales-schedule.component';
import { FundersComponent } from './loan/funders/funders.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoanModalComponent } from './loan/loan-modal/loan-modal.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LoansComponent,
    LoanComponent,
    LoanModalComponent,
    FundersComponent,
    SchemeComponent,
    UnitsComponent,
    UnitModalComponent,
    UnitCardComponent,
    SchemeModalComponent,
    IncomeAndValueComponent,
    StrategyModalComponent,
    SalesScheduleComponent,
  ],
  exports: [
    LoansComponent,
    LoanComponent,
    LoanModalComponent,
    FundersComponent,
    SchemeComponent,
    UnitsComponent,
    UnitModalComponent,
    UnitCardComponent,
    SchemeModalComponent,
    IncomeAndValueComponent,
    StrategyModalComponent,
    SalesScheduleComponent,
  ]
})
export class LoansModule { }
