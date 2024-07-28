import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignupPageComponent} from "./Components/signup-page/signup-page.component";
import {LoginPageComponent} from "./Components/login-page/login-page.component";
import {MainPageComponent} from "./Components/main-page/main-page.component";
import {authGuard} from "./auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignupPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'main', component: MainPageComponent ,canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
