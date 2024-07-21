import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://192.168.1.4:80'; // Update this with your Flask API URL

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        if (response.user && response.user.id) {
          localStorage.setItem('userId', response.user.id);
        }
        return response;
      })
    );
  }

  signUp(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, { username, email, password });
  }

  getUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }


}
