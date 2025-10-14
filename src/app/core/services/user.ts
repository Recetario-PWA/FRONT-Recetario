import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { allNotisWithoutFilter, approveNotifications, notifications, notificationsLoading } from '../stores/auth.store';

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
    this.http.get<any>(`${environment.apiUrlBase}notifications`).subscribe({
      next: (response) => {
        if (response.data) {
          let allNotis = response.data;
          allNotisWithoutFilter.set(response.data);

          const commentNotis = allNotis.filter((response: any) => 
            response.data.type === 'COMMENT'
          );

          const approveNotis = allNotis.filter((response: any) => 
            response.data.type === 'ADMINRESPONSE'
          )

          notifications.set(commentNotis);
          approveNotifications.set(approveNotis);

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

  sendRequestRole(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}role-request`, data);
  }
}
