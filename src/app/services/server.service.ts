import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServerService {
    private apiUrl = 'http://192.168.1.3:80/servers';  // Ensure this is correct

    constructor(private http: HttpClient) { }

    getServers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    updateServer(server: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${server.id}`, server);  // Corrected URL
    }

    deleteServer(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
