import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://192.168.1.3:80'; // Update this with your Flask API URL

  constructor(private http: HttpClient) { }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
          tap(response => {
            console.log('Login response:', response);

            if (response && response.token) {
              const token = response.token;
              const user = response.user;

              localStorage.setItem('token', token);
              localStorage.setItem('userId', user.id.toString());
              console.log('Stored token:', localStorage.getItem('token'));
              console.log('Stored userId:', localStorage.getItem('userId'));
            }
          })
      );
    }

    isLoggedIn(): boolean {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      return !!token;
    }

  signUp(username: string, email: string, password: string, avatar: string): Observable<any> {
    const user = { username, email, password, avatar };
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }


}
