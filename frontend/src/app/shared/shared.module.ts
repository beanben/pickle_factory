import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotDirective } from './shared.directive';
import { DeleteComponent } from './delete.component';
import { EditComponent } from './edit.component';
import { InitialsPipe } from './initials.pipe';
import { InitialPipe } from './initial.pipe';
import { RequiredComponent } from './required.component';
import { ToggleComponent } from './toggle.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DotDirective,
    DeleteComponent,
    EditComponent,
    RequiredComponent,
    ToggleComponent,
    InitialsPipe,
    InitialPipe
  ],
  exports: [
    DotDirective,
    DeleteComponent,
    EditComponent,
    RequiredComponent,
    ToggleComponent,
    InitialsPipe,
    InitialPipe,
  ]
})
export class SharedModule { }
