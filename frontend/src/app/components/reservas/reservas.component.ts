import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BookingRequest } from '../../interfaces/bookingRequest.interface';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {

  availableSpace: number | null = null;
  selectedDate: string | null = null;
  selectedTurno: string | null = null;
  formCreateBooking!: FormGroup;
  timeOptions: string[] = [];


  constructor(private bookingService: BookingService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }


  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm(): void {
    this.formCreateBooking = this.formBuilder.group({
      userBooker: this.formBuilder.group({
        username: [{ value: this.authService.getUsername(), disabled: true }, Validators.required]
      }),
      date: ["", Validators.required],
      amountPeople: ["", Validators.required],
      turno: ["", Validators.required],
      time: ["", Validators.required],
    });


    this.formCreateBooking.valueChanges.subscribe(() => {
      const date = this.formCreateBooking.get("date")?.value;
      const turno = this.formCreateBooking.get("turno")?.value;

      if (date && turno) {
        this.selectedDate = date;
        this.selectedTurno = turno;
        this.updateTimeOptions(turno);
        this.checkAvailability();
      }
    });
  }

  
  updateTimeOptions(turno: string): void {
    if (turno === 'comida') {
      this.timeOptions = ['13:30', '14:00', '14:30', '15:00'];
    } else if (turno === 'cena') {
      this.timeOptions = ['20:00', '20:30', '21:00', '21:30', '22:00'];
    }
  }


  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.selectedDate = inputElement.value;
      this.checkAvailability(); 
    } else {
      console.log('onDateChange: No input element found'); 
    }
  }
  
  onTurnoChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.selectedTurno = inputElement.value;
      this.checkAvailability();
    }
  }

  checkAvailability(): void {
    if (this.selectedDate) {
      const selectedDay = new Date(this.selectedDate);
      const isMonday = selectedDay.getUTCDay() === 1;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDay < today) {
        this.toast.error('No se puede seleccionar una fecha anterior a hoy.');
        this.availableSpace = null;
        return;
      } else if (isMonday) {
        this.toast.error('Perdona, los Lunes estamos cerrados por descanso del personal. Visítanos cualquier otro día de la semana.');
        this.availableSpace = null;
        return;
      } else if (this.selectedTurno) {
        this.bookingService.getAvailableSpace(this.selectedDate, this.selectedTurno).subscribe({
          next: (space) => {
            this.availableSpace = space;
          },
          error: (error) => {
            const errorMessage = error.error ? error.error : 'Error desconocido';
            this.toast.error(errorMessage);
          }
        });
      } else {
        this.availableSpace = null;
      }
    } else {
      this.toast.error('Por favor, escoge una fecha');
    }
  }
  


  createBooking(): void {

    if (this.formCreateBooking.invalid) {
      this.toast.error('Por favor, rellena todos los campos.');
      return;
    }

    const token = this.authService.getToken();

    if (token) {
      const bookingData: BookingRequest = {
        ...this.formCreateBooking.value,
        userBooker: {
          username: this.authService.getUsername()
        }
      };

      const selectedDay = new Date(this.formCreateBooking.get("date")?.value);
      const today = new Date();
      const month = today.getMonth() + 1;
      today.setHours(0, 0, 0, 0);

      if (selectedDay < today) {
        this.toast.error('No va a funcionar. Ya te hemos dicho que no se puede hacer una reserva para una fecha anterior a hoy.');
        return;
      }

      if (selectedDay.getUTCDay() === 1) {
        this.toast.error('No va a funcionar. Ya te hemos dicho que por descanso del personal, no se trabajan los Lunes.');
        return;
      }

      const amountPeople = this.formCreateBooking.get("amountPeople")?.value;

      if (amountPeople > 15) {
        this.toast.error('Por favor, contacta por teléfono con nosotros para si vas a hacer grandes reservas.');
        return;
      }

      if (amountPeople <= 0) {
        this.toast.error('Por favor, la cantidad de personas no puede ser cero o menor que cero, no me jodas.');
        return;
      }

      if (this.availableSpace !== null && amountPeople >= this.availableSpace) {
        this.toast.error('Perdona, pero no tenemos capacidad para tantas personas. Por favor, contacta por teléfono con nosotros y te confirmamos si tenemos espacio o no');
        return;
      }

      this.bookingService.createBooking(bookingData, token).subscribe({
        next: (response) => {
          this.toast.success(response);
          this.router.navigate(['/menu']);
        },
        error: (error) => {
          const errorMessage = error.error ? error.error : 'Error desconocido';
          this.toast.error(errorMessage);
        }
      });
    }
    else {
      this.toast.error("Solo los usuarios pueden hacer reservas. Por favor, inicia sesión o regístrate para hacer la reserva")
    }
  }
}