import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Angular標準Module
 *
 * @export
 * @class AngularCommonModule
 */
@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    CommonModule,
    DragDropModule,
    ReactiveFormsModule
  ],
  exports: [
    DatePipe,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AngularCommonModule { }
