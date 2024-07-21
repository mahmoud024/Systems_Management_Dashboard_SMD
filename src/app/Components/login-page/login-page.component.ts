import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    this.userService.login(this.email, this.password).subscribe(
      response => {
        // Handle successful login
        console.log('Login successful', response);
        this.router.navigate(['/main']);
      },
      error => {
        // Handle login error
        console.error('Login error', error);
      }
    );
  }
}
