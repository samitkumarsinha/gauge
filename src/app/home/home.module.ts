import { GaugemeterComponent } from './gaugemeter/gaugemeter.component';
import { MeterComponent } from './meter/meter.component';
import { LandingComponent } from './landing/landing.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, LandingComponent, MeterComponent, GaugemeterComponent]
})
export class HomePageModule {}
