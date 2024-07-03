import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu, MenuOfDay } from '../interfaces/dish.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }

  createMenu(menuData: Menu, token:string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/admin/menus`, menuData, { headers, responseType: "text" });
  }

  getMenuById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.baseUrl}/admin/menus/${id}`);
  }
  
  getMenuByDate(date: string): Observable<MenuOfDay[]> {
    return this.http.get<MenuOfDay[]>(`${this.baseUrl}/menus/${date}`);
  }

  updateMenu(id: number, menuData: Menu, token:string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.baseUrl}/admin/menus/${id}`, menuData, { headers, responseType: "text" } );
  }


}
