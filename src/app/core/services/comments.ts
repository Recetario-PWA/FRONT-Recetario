import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Comments {
  private baseUrl: string;
  
  constructor(private http: HttpClient){
    this.baseUrl = `${environment.apiUrlBase}comments/`;
  }

  getComments(): Observable<any> {
   return this.http.get<any>(`${this.baseUrl}history-comments`);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}${id}`);
  }
}
