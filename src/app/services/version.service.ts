import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private apiUrl = 'http://192.168.1.3/update_product_versions'; // Update with your API URL

  constructor(private http: HttpClient) {}

  updateVersion(): Observable<any> {
    return this.http.post(this.apiUrl, {});
  }
}
