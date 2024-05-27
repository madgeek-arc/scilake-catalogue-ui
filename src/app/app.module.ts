import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReusableComponentsModule } from "../dataSpaceUI/app/shared/reusablecomponents/reusable-components.module";
import { DataSpaceUIModule } from "../dataSpaceUI/app/dataSpaceUI.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DataSpaceUIModule,
    ReusableComponentsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
