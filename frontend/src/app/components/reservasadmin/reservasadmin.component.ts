import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BookingRequest } from '../../interfaces/bookingRequest.interface';



@Component({
  selector: 'app-reservasadmin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reservasadmin.component.html',
  styleUrl: './reservasadmin.component.css'
})
export class ReservasadminComponent {

  bookings: BookingRequest[] = [];
  filteredBookings: BookingRequest[] = [];
  filters = {
    username: '',
    date: '',
    turno: '',
    time: '',
    amountPeople: ''
  };
  constructor(private bookingService: BookingService,
    private toast: ToastrService,
    private authService: AuthService,
    private router: Router) { }

    
  ngOnInit(): void {
    this.getBookings();
  }

  getBookings(): void {
    const token = this.authService.getToken();
    if (token) {
      this.bookingService.getAllBookings(token).subscribe({
        next: (data) => {
          const today = new Date();
          const tenDaysAgo = new Date(today);
          tenDaysAgo.setDate(today.getDate() - 5);

          this.bookings = data.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= tenDaysAgo;
          });
          this.applyFilters(); 
        },
        error: (error) => {
          if (error.status === 403) {
            this.toast.error("Lo siento, solo los usuarios con permiso pueden ver estos datos.");
          } else if (error.status === 401) {
            this.toast.error("Su sesión ha expirado. Por favor, inicie sesión de nuevo");
          } else {
            let errorMessage = error.error ? error.error : 'Error desconocido';
            this.toast.error(errorMessage);
          }
        }
      });
    } 
  }

  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(booking =>
      booking.userBooker.username.toLowerCase().includes(this.filters.username.toLowerCase()) &&
      booking.date.includes(this.filters.date) &&
      booking.turno.includes(this.filters.turno) &&
      booking.time.includes(this.filters.time) &&
      (this.filters.amountPeople === '' || booking.amountPeople.toString() === this.filters.amountPeople)
    );
  }

  goToUsernameInfo(username:string): void{
    this.router.navigate(['/reservas-admin', username]);
  }
}