import { Injectable } from '@angular/core';
import { BookingRequest } from '../interfaces/bookingRequest.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingResponse } from '../interfaces/bookingResponse.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllBookings(token: string): Observable<BookingRequest[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<BookingRequest[]>(`${this.baseUrl}/admin/bookings`, { headers, withCredentials: true })
  }

  getBookingsByDate(date: string): Observable<BookingRequest[]> {
    return this.http.get<BookingRequest[]>(`${this.baseUrl}/bookings/date/${date}`);
  }

  createBooking(booking: BookingRequest, token: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/users/bookings`, booking, { headers, responseType: "text", withCredentials: true });

  }

  getAvailableSpace(date: string, turno: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/bookings/available/${date}/${turno}`);
  }

}
