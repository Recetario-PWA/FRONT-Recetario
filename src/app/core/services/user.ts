import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class User {
  private baseUrl: string;

  constructor(private http: HttpClient){
    this.baseUrl = `${environment.apiUrlBase}user/`;
  }

  updateUser(data: any):  Observable<any> {
    return this.http.put(`${this.baseUrl}`, data);
  }
}
