import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://192.168.1.3:80/reservations';

  constructor(private http: HttpClient) { }

    getReservations(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    addReservation(reservation: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, reservation);
    }

    updateReservation(reservation: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${reservation.id}`, reservation);
    }

    deleteReservation(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

}


