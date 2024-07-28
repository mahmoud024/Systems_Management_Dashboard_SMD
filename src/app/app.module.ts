import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { SignupPageComponent } from './Components/signup-page/signup-page.component';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReservationService} from "./services/reservation.service";
import {authGuard} from "./auth.guard";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SignupPageComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

  ],
  providers: [ReservationService,authGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
