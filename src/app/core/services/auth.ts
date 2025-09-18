import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl: string;

  constructor(private httpClient: HttpClient){
    this.baseUrl = `${environment.apiUrlBase}auth/`;
  }

  login(loginData: any): Observable<any>{
    return this.httpClient.post(`${this.baseUrl}login`, loginData);
  }

  //Token
  getToken() {
    return localStorage.getItem('auth_token');
  }
  setToken(token: string){
    localStorage.setItem('auth_token',token);
  }
  
}
