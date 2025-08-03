import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTopComponent } from './components/menu-top/menu-top.component';
import { MaterialUIModule } from "src/app/material-ui-module";



@NgModule({
  declarations: [
    MenuTopComponent
  ],
  imports: [
    CommonModule,
    MaterialUIModule
  ],
  exports: [
    MenuTopComponent
  ]
})
export class MenuModule { }
