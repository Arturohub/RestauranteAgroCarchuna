import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactRequest } from '../../interfaces/contactRequest.interface';
import { ContactService } from '../../services/contact.service';
import { ContactResponse } from '../../interfaces/contactResponse.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  dissappearButton: boolean = true;

  constructor(private contactService: ContactService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}



  formContact: FormGroup = this.formBuilder.group({
    name: ["", Validators.required],
    email: ["", Validators.required],
    message: ["", Validators.required],
  });
  

  sendContactEmail(): void {
    if (this.formContact.invalid) {
      this.toast.error('Por favor, rellena todos los campos.');
      return;
    }
   
    const token = this.authService.getToken();
    if (token) {
      const contactData: ContactRequest = {
        name: this.formContact.value.name,
        email: this.formContact.value.email,
        message: this.formContact.value.message
      };
      this.contactService.sendContactMessage(contactData, token)
        .subscribe(
          (response) => {
            this.dissappearButton = false;
            this.toast.success(response.message);
            this.router.navigate(["/menu"]);
            
          },
          (error) => {
            this.toast.error(error.error.message || 'Error enviando el mensaje. Por favor, prueba otra vez.');
          }
        );
    } else {
      this.toast.error('Regístrate si aún no tienes cuenta o inicia sesión si ya la tienes, para poder contactar con nosotros!');
    }
  }
}