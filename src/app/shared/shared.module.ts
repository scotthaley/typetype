import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { DialogComponent } from './dialog/dialog.component';



@NgModule({
  declarations: [
    ModalComponent,
    DialogComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    DialogComponent
  ]
})
export class SharedModule { }
