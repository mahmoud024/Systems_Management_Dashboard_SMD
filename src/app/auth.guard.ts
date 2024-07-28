import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "./services/user.service";

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const loggedIn = this.userService.isLoggedIn();
    console.log('Checking if user is logged in');
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }
    console.log('User is logged in:', loggedIn);
    return loggedIn;
  }
}
