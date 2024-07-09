import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { dish } from '../interfaces/dish.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getAllDishes(): Observable<dish[]> {
    return this.http.get<dish[]>(`${this.baseUrl}/dishes`)
  }

  getDishById(id: number): Observable<dish> {
    return this.http.get<dish>(`${this.baseUrl}/dishes/${id}`);
  }

  getDishesByCategory(category: string): Observable<dish[]> {
    return this.http.get<dish[]>(`${this.baseUrl}/dishes/category/${category}`);
  }

  createDish(dish: dish, token: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/admin/dishes`, dish, { headers, responseType: "text", withCredentials: true  });

  }

  updateDish(id: number, dish: dish, token: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.baseUrl}/admin/dishes/${id}`, dish, { headers, responseType: "text", withCredentials: true  });
  }

  deleteDish(id: number, token: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.baseUrl}/admin/dishes/${id}`, { headers, responseType: "text", withCredentials: true  });
  }


}
