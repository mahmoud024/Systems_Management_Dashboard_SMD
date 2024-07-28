import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';
  loginError: string | null = null;

  constructor(private userService: UserService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  appendDefaultDomain() {
    const defaultDomain = '@hp.com';
    if (this.email && !this.email.includes(defaultDomain)) {
      this.email = this.email + defaultDomain;
    }
  }

  onSubmit() {
    if (this.email && this.password) {
      this.userService.login(this.email, this.password).subscribe(
          response => {
            console.log('Login successful', response);
            console.log('Stored token:', localStorage.getItem('token'));
            console.log('Stored userId:', localStorage.getItem('userId'));
            this.router.navigate(['/main']);
          },
          error => {
            console.error('Login error', error);
            if (error.status === 401) {
              this.loginError = 'Incorrect email or password';
            } else {
              this.loginError = 'An error occurred. Please try again.';
            }
          }
      );
    }
  }



}
