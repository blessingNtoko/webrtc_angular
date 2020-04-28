import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Peer1Component } from './peer1/peer1.component';
import { Peer2Component } from './peer2/peer2.component';

@NgModule({
  declarations: [
    AppComponent,
    Peer1Component,
    Peer2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
