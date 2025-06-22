import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [],
  imports: [
    ButtonModule,
    CardModule,
    DialogModule,
    CalendarModule,
    InputTextModule,
    ToastModule,
    EditorModule,
    TabViewModule,
    TooltipModule,
    CheckboxModule,
    SplitterModule,
    MessagesModule,
    InputNumberModule,
    RadioButtonModule,
    SelectButtonModule,
    ConfirmDialogModule,
    DatePickerModule,
    InputGroupModule,
    InputGroupAddonModule,
    DragDropModule,
    InputMaskModule
  ],
  exports: [
    ButtonModule,
    CardModule,
    DialogModule,
    CalendarModule,
    InputTextModule,
    ToastModule,
    EditorModule,
    TabViewModule,
    TooltipModule,
    CheckboxModule,
    SplitterModule,
    MessagesModule,
    InputNumberModule,
    RadioButtonModule,
    SelectButtonModule,
    ConfirmDialogModule,
    DatePickerModule,
    InputGroupModule,
    InputGroupAddonModule,
    DragDropModule,
    InputMaskModule
  ]
})
export class PrimengUiModule { }
