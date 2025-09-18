import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Recipe {
  private baseUrl: string;
  private commentsBaseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiUrlBase}recipes/`;
    this.commentsBaseUrl = `${environment.apiUrlBase}comments/`;
  }

  getAllRecipes(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getRecipe(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${id}`);
  }

  getComments(): Observable<any> {
    return this.http.get<any>(this.commentsBaseUrl);
  }

  addComment(data: any): Observable<any> {
    return this.http.post(`${this.commentsBaseUrl}`, data);
  }
}
