import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ServerService } from '../../services/server.service';
import { ReservationService } from '../../services/reservation.service';
import { HttpClient } from "@angular/common/http";
import { interval, Subscription } from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
    animations: [
        trigger('toggleHeight', [
            state('collapsed', style({
                height: '30px' // collapsed height
            })),
            state('expanded', style({
                height: '170px' // expanded height
            })),
            transition('collapsed <=> expanded', [
                animate('0.5s ease-in-out')
            ])
        ]),
        trigger('popupAnimation', [
            state('void', style({
                transform: 'scale(0.8)',
                opacity: 0
            })),
            state('*', style({
                transform: 'scale(1)',
                opacity: 1
            })),
            transition('void <=> *', animate('300ms ease-in-out'))
        ]),
        trigger('popupAnimation2', [
            state('void', style({
                transform: 'scale(0.2)',
                opacity: 0
            })),
            state('*', style({
                transform: 'scale(1)',
                opacity: 1
            })),
            transition('void <=> *', animate('300ms ease-in-out'))
        ]),
    ],
})
export class MainPageComponent implements OnInit, OnDestroy {
    servers: any[] = [];
    filteredServers: any[] = [];
    reservations: any[] = [];
    searchQuery = '';
    selectedServer: any = null;
    userProfile = {
        id: null,
        username: '',
        email: '',
        avatar: '' // Default avatar path
    };
    showProfilePopup = false;
    pollingSubscription: Subscription;
    expandedState: number | null = null;
    showUpdateServerPopup = false;
    selectedServerForUpdate: any = null;

    constructor(
        private router: Router,
        private userService: UserService,
        private serverService: ServerService,
        private reservationService: ReservationService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.fetchUserProfile();
        this.fetchServers();
        this.fetchReservations();
      this.updateProductVersions();

        // Polling for reservations every 10 seconds
        this.pollingSubscription = interval(3600000).subscribe(() => {
            this.fetchReservations();
            this.updateProductVersions();

        });
    }

  updateProductVersions() {
    this.http.get('http://192.168.1.3/update_product_versions', {}).subscribe(
      response => {
        console.log('Product versions updated successfully:', response);
        // Optionally, refresh the servers to reflect any changes.
        this.fetchServers();
      },
      error => {
        console.error('Error updating product versions:', error);
        alert('Failed to update product versions.');
      }
    );
  }

    ngOnDestroy() {
        if (this.pollingSubscription) {
            this.pollingSubscription.unsubscribe();
        }
    }

    fetchUserProfile() {
        const userId = localStorage.getItem('userId');
        console.log('Retrieved User ID:', userId);
        if (userId) {
            this.userService.getUser(Number(userId)).subscribe(
                user => {
                    this.userProfile.id = user.id;
                    this.userProfile.username = user.username;
                    this.userProfile.email = user.email;
                    this.userProfile.avatar = user.avatar || 'default-avatar.png';
                    console.log('Fetched user profile:', this.userProfile);
                },
                error => {
                    console.error('Error fetching user data', error);
                }
            );
        } else {
            console.error('User ID not found');
        }
    }


    fetchServers() {
        this.serverService.getServers().subscribe(
            servers => {
                this.servers = servers.map((server: any[]) => ({
                    id: server[0],
                    name: server[1],
                    ip_address: server[2],
                    location: server[3],
                    version: server[4],
                }));
                this.filteredServers = [...this.servers];
            },
            error => {
                console.error('Error fetching servers', error);
            }
        );
    }

    fetchReservations() {
        this.reservationService.getReservations().subscribe(
            reservations => {
                const now = new Date();
                this.reservations = reservations.filter(reservation => new Date(reservation[4]) >= now);
                this.reservations = this.reservations.map((reservation: any[]) => ({
                    id: reservation[0],
                    user_id: reservation[1],
                    server_id: reservation[2],
                    reservation_from_date: new Date(reservation[3]),
                    reservation_to_date: new Date(reservation[4]),
                    username: reservation[5],
                    server_name: reservation[6],
                    location: reservation[7],
                    is_reserved: reservation[8]
                }));
            },
            error => {
                console.error('Error fetching reservations', error);
            }
        );
    }

    toggleCard(serverId: number, event: Event) {
        event.stopPropagation(); // Prevents parent click event
        if (this.expandedState === serverId) {
            this.expandedState = null; // Collapse if the same card is clicked
        } else {
            this.expandedState = serverId; // Expand the clicked card
        }
    }

    // Method to open the update popup
    openUpdatePopup(server: any) {
        this.selectedServerForUpdate = { ...server }; // Clone the server data
        this.showUpdateServerPopup = true;
    }

    // Method to close the update popup
    closeUpdatePopup() {
        this.showUpdateServerPopup = false;
        this.selectedServerForUpdate = null;
    }

    // Method to update server details
    updateServer(event: Event) {
        event.preventDefault(); // Prevent form submission

        if (this.selectedServerForUpdate) {
            this.serverService.updateServer(this.selectedServerForUpdate).subscribe(
                (response) => {
                    alert('Server updated successfully');
                    this.fetchServers(); // Refresh the list of servers
                    this.closeUpdatePopup(); // Close the popup
                },
                (error) => {
                    console.error('Error updating server', error);
                }
            );
        }
    }



    deleteServer(id: number) {
        if (confirm('Are you sure you want to delete this server?')) {
            this.serverService.deleteServer(id).subscribe(
                response => {
                    alert('Server deleted successfully');
                    this.fetchServers(); // Refresh the list of servers
                },
                error => {
                    console.error('Error deleting server:', error);
                    alert('Failed to delete server');
                }
            );
        }
    }


    toggleProfilePopup() {
        this.showProfilePopup = !this.showProfilePopup;
    }

    formatDate(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleString('en-US', options).replace(',', '');
    }

    onSearchChange() {
        this.filteredServers = this.servers.filter(server =>
            server.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }


    selectServer(server: any) {
        this.selectedServer = server;
    }

    isServerReserved(serverId: number): boolean {
        const now = new Date();
        return this.reservations.some(reservation =>
            reservation.server_id === serverId &&
            reservation.reservation_from_date <= now &&
            reservation.reservation_to_date >= now
        );
    }

    logout(event: Event) {
        event.stopPropagation();
        this.showProfilePopup = false;
        localStorage.removeItem('userId'); // Clear user ID on logout
        localStorage.removeItem('token');

        this.router.navigate(['/login']);
    }


    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const profilePopup = document.getElementById('profilePopup');
        const userProfile = document.querySelector('.user-profile');

        if (this.showProfilePopup && !userProfile?.contains(target) && !profilePopup?.contains(target)) {
            this.showProfilePopup = false;
        }
    }

    reserveServer(event: Event) {
        event.preventDefault();

        const dateFromInput = document.getElementById('dateFrom') as HTMLInputElement;
        const dateToInput = document.getElementById('dateTo') as HTMLInputElement;

        if (!this.selectedServer) {
            alert('Please select a server.');
            return;
        }

        if (!dateFromInput.value || !dateToInput.value) {
            alert('Please select both start and end dates.');
            return;
        }

        const reservation = {
            user_id: this.userProfile.id,
            server_id: this.selectedServer.id,
            reservation_from_date: new Date(dateFromInput.value),
            reservation_to_date: new Date(dateToInput.value)
        };

        this.reservationService.addReservation(reservation).subscribe(
            res => {
                alert('Server reserved successfully');
                this.selectedServer = null;
                (document.getElementById('entryForm') as HTMLFormElement).reset();
                this.fetchReservations();  // Refresh reservations
            },
            error => {
                console.error('Error reserving server', error);
            }
        );
    }


    deleteReservation(reservationId: number) {
        this.reservationService.deleteReservation(reservationId).subscribe(
            res => {
                alert('Reservation deleted successfully');
                this.fetchReservations();  // Refresh reservations
            },
            error => {
                console.error('Error deleting reservation', error);
            }
        );
    }

    renewReservation(reservation: any) {
        const newReservationToDate = new Date(reservation.reservation_to_date.getTime() + (reservation.reservation_to_date.getTime() - reservation.reservation_from_date.getTime()));

        const updatedReservation = {
            ...reservation,
            reservation_to_date: newReservationToDate
        };

        this.reservationService.updateReservation(updatedReservation).subscribe(
            res => {
                alert('Reservation renewed successfully');
                // Refresh reservations
                this.fetchReservations();
            },
            error => {
                console.error('Error renewing reservation', error);
            }
        );
    }
}
