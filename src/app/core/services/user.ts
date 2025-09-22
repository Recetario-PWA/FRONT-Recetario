import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { notifications, notificationsLoading } from '../stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class User {
  private baseUrl: string;
  private baserNotificationsUrl: string;

  constructor(private http: HttpClient){
    this.baseUrl = `${environment.apiUrlBase}user/`;
    this.baserNotificationsUrl = `${environment.apiUrlBase}notifications/`;
  }

  updateUser(data: any):  Observable<any> {
    return this.http.put(`${this.baseUrl}`, data);
  }

  getNotifications() {
    notificationsLoading.set(true);
    this.http.get<any>(`${this.baserNotificationsUrl}`).subscribe({
      next: (response) => {
        if (response.data) {
          notifications.set(response.data);
          notificationsLoading.set(false);
        } else {
          notifications.set(null);
          notificationsLoading.set(false);
        }
      },
      error: (error) => {
        notifications.set(null);
        notificationsLoading.set(false);
      }
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.http.post(`${environment.apiUrlBase}notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${environment.apiUrlBase}notifications/read-all`, {});
  }
}
