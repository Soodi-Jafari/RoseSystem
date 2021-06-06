import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* components */
import { AlertComponent } from './components/alert/alert.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AlertComponent,
  ],
  exports: [
    AlertComponent,
  ]
})
export class SharedModule { }
