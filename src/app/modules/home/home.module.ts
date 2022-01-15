import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BackgroundComponent } from './components/background/background.component';
import { SharedModule } from '../../shared/shared.module';
import { LoginModalComponent } from './components/login-modal/login-modal.component';


@NgModule({
  declarations: [
    HomeComponent,
    BackgroundComponent,
    LoginModalComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
