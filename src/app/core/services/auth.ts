import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { currentUser } from '../stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl: string;
  private token: string | null = null;

  constructor(private httpClient: HttpClient){
    this.baseUrl = `${environment.apiUrlBase}auth/`;
  }

  login(loginData: any): Observable<any>{
    return this.httpClient.post(`${this.baseUrl}login`, loginData);
  }

  register(registerData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}register`, registerData);
  }

  verifyCode(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}code`, data);
  }

  //Token
  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    this.token = localStorage.getItem('auth_token');

    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  //INFO DEL USUARIO
  //lo deje aqui porque tiene la ruta auth xd
  getUserInfo() {
    this.httpClient.get<any>(`${this.baseUrl}about-me`).subscribe({
      next: (response) => {
        if (response.result) {
          currentUser.set(response.data);
        } else {
          currentUser.set(null);
        }
      },
      error: (error) => {
        currentUser.set(null);
        console.log(error);
      }
    });
  }

  logout(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}logout`, '').pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        this.token = null;
        currentUser.set(null);
      })
    );
  }  
}
