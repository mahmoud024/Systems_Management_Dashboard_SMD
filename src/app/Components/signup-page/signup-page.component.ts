import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";

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
  selectedAvatar: string | null = null;
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    console.log(this.username, this.email, this.password);  // Debugging line
    this.userService.signUp(this.username, this.email, this.password).subscribe(
      response => {
        // Handle successful sign-up
        console.log('Sign-up successful', response);
        this.router.navigate(['/login']);
      },
      error => {
        // Handle sign-up error
        console.error('Sign-up error', error);
      }
    );
  }

  @ViewChild('avatarScroll', { static: false }) avatarScroll: ElementRef<HTMLDivElement>;

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
  }

  scrollLeft() {
    this.avatarScroll.nativeElement.scrollBy({ left: -221, behavior: 'smooth' });
  }

  scrollRight() {
    this.avatarScroll.nativeElement.scrollBy({ left: 221, behavior: 'smooth' });
  }
}
