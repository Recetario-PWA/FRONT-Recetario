import { HttpClient, HttpParams } from '@angular/common/http';
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

  getRecipe(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${id}`);
  }

  getComments(): Observable<any> {
    return this.http.get<any>(this.commentsBaseUrl);
  }

  addComment(data: any): Observable<any> {
    return this.http.post(`${this.commentsBaseUrl}`, data);
  }

  userRecipes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}user-recipes`);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}`);
  }
  
  favorites(recipesIds: any[]): Observable<any> {
    let params = new HttpParams();
    recipesIds.forEach(id => {
      params = params.append('favorites[]', id);
    });
    return this.http.get<{ data: any[] }>(`${this.baseUrl}favorites`, { params });
  }

  newRecipe(data: any): Observable<any> {
     return this.http.post(`${this.baseUrl}`, data);
  }

  editRecipe(id: any, data: any): Observable<any> {
     return this.http.post(`${this.baseUrl}${id}`, data);
  }
}
