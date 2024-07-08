import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { registerRequest } from '../interfaces/registerRequest.interface';
import { registerResponse } from '../interfaces/registerResponse.interface';
import { loginRequest } from '../interfaces/loginRequest.interface';
import { jwtDecode } from "jwt-decode";
import { myUser } from '../interfaces/myUser.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://restaurante-agrocarchuna-api.onrender.com/api"
  private tokenKey: string = environment.tokenName;

  public authStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  register(user: registerRequest ): Observable<registerResponse> {
    return this.http.post<registerResponse>(`${this.baseUrl}/auth/register`, user)
  }

  login(credentials: loginRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials, { responseType: 'text' });
  }

  setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token);
    this.authStatus.emit(true);
  }

  getToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }


  logout(): void {
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe(() => {
      this.cookieService.delete(this.tokenKey);
      this.authStatus.emit(false);
      this.router.navigate(['/login']);
    });
  } 

  extractUsernameFromToken(token: string): string {
    const decoded = jwtDecode(token);
    return decoded?.sub || '';
  }

  extractRoleFromToken(token: string): string {
    const decoded: any = jwtDecode(token);
    return decoded?.role || '';
  }

  extractImageFromToken(token: string): string {
    const decoded: any = jwtDecode(token);
    return decoded?.image || '';
  }

  getUsername(): string {
    const token = this.getToken();
    return token ? this.extractUsernameFromToken(token) : '';
  }

  getUserImage(): string {
    const token = this.getToken();
    return token ? this.extractImageFromToken(token) : '';
  }

  getUserInformation(username: string, token: string): Observable<myUser>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<myUser>(`${this.baseUrl}/admin/auth/users/${username}`, { headers })
  }
}