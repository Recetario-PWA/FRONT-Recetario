import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { from, Observable, switchMap, tap } from 'rxjs';
import { currentUser, userInfoLoading } from '../stores/auth.store';
import { PushService } from './push';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl: string;
  private token: string | null = null;

  constructor(private httpClient: HttpClient, private push: PushService, private alertCtrl: AlertController){
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

  changePassword(data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}change-password`, data);
  }
  
  sendCode(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}resend-code`, data);
  }
  //INFO DEL USUARIO
  //lo deje aqui porque tiene la ruta auth xd
  getUserInfo(): Observable<any> {
    userInfoLoading.set(true);
    return this.httpClient.get<any>(`${this.baseUrl}about-me`).pipe(
      tap({
        next: (response) => {
          if (response.result) {
            currentUser.set(response.data);
          } else {
            currentUser.set(null);
          }
          userInfoLoading.set(false);
        },
        error: () => {
          currentUser.set(null);
          userInfoLoading.set(false);
        }
      })
    );
  }

  resendCode(email: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}resend-code`, {email: email});
  }

  logout(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}logout`, '').pipe(
      switchMap(() =>
        from(this.push.clear())
      ),
      tap(() => {
        localStorage.removeItem('auth_token');
        this.token = null;
        currentUser.set(null);
      })
    );
  }
}
