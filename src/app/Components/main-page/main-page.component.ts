import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  servers = [
    'Server 1',
    'Server 2',
    'Server 3',
    // more servers
  ];
  showProfilePopup = false;
  filteredServers = [...this.servers];
  searchQuery = '';
  selectedServer = ''; // Variable to hold the selected server
  userProfile = {
    id: null,
    username: '',
    email: '',
    avatar: './assets/Profile/user.png' // Default avatar path
  };

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUser(Number(userId)).subscribe(
        user => {
          this.userProfile.id = user.id;
          this.userProfile.username = user.username;
          this.userProfile.email = user.email;
          this.userProfile.avatar = './assets/Profile/user.png'; // Or set dynamically if available
        },
        error => {
          console.error('Error fetching user data', error);
        }
      );
    } else {
      // Handle the case where the user ID is not available
      console.error('User ID not found');
    }
  }

  toggleProfilePopup() {
    this.showProfilePopup = !this.showProfilePopup;
  }

  onSearchChange() {
    this.filteredServers = this.servers.filter(server =>
      server.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectServer(server: string) {
    this.selectedServer = server;
  }

  logout(event: Event) {
    event.stopPropagation();
    this.showProfilePopup = false;
    localStorage.removeItem('userId'); // Clear user ID on logout
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const profilePopup = document.getElementById('profilePopup');

    if (this.showProfilePopup && !target.closest('.user-profile')) {
      this.showProfilePopup = false;
    }
  }
}
