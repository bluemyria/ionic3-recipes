import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SLOptionsPage } from './sl-options';

@NgModule({
  declarations: [
    SLOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(SLOptionsPage),
  ],
})
export class SLOptionsPageModule { }
