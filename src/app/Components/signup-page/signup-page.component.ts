import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  avatars = [
    'assets/Avatars/1.png',
    'assets/Avatars/2.png',
    'assets/Avatars/3.png',
    'assets/Avatars/4.png',
    'assets/Avatars/5.png',
    'assets/Avatars/6.png',
    'assets/Avatars/10.png',
    'assets/Avatars/11.png',
    'assets/Avatars/13.png',
    'assets/Avatars/14.png'
  ];

  signupForm: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  selectedAvatar: string = '';

  constructor(private userService: UserService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email, this.hpEmailValidator()]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]), // Password must be at least 5 characters
      confirmPassword: new FormControl('', Validators.required),
      avatar: new FormControl('', [Validators.required, this.avatarValidator()]),
    }, { validators: this.passwordMatchValidator });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
    this.confirmPasswordFieldType = this.confirmPasswordVisible ? 'text' : 'password';
  }

  hpEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value && !value.endsWith('@hp.com') ? { hpEmail: true } : null;
    };
  }

  avatarValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value ? null : { required: true };
    };
  }

  passwordMatchValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
  };

  markAllAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  onSubmit() {
    this.markAllAsTouched(this.signupForm);
    if (this.signupForm.valid) {
      const { username, email, password, avatar } = this.signupForm.value;
      this.userService.signUp(username, email, password, avatar).subscribe(
        response => {
          console.log('Sign-up successful', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Sign-up error', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.signupForm.get('avatar')?.setValue(avatar);
  }

  @ViewChild('avatarScroll') avatarScroll!: ElementRef;

  scrollLeft() {
    this.avatarScroll.nativeElement.scrollBy(-100, 0);
  }

  scrollRight() {
    this.avatarScroll.nativeElement.scrollBy(100, 0);
  }
}
