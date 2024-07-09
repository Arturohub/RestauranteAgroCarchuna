import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactRequest } from '../interfaces/contactRequest.interface';
import { ContactResponse } from '../interfaces/contactResponse.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  sendContactMessage(contactData: ContactRequest, token: string): Observable<ContactResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<ContactResponse>(`${this.baseUrl}/users/contact`, contactData, { headers, withCredentials: true  });
  }
}