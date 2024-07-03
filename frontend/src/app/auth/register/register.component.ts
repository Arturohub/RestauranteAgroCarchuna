import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  dissappearButton: boolean = true;

  constructor(private authService: AuthService, 
    private router: Router, 
    private formBuild: FormBuilder, 
    private cookieService: CookieService,
    private toast: ToastrService){}

 
  public formRegister: FormGroup = this.formBuild.group({
    name: ["", Validators.required],
    familyName: ["", Validators.required],
    username: ["", Validators.required],
    password:["", Validators.required],
    email:["", Validators.required],
    image:"",
    mobileNumber:["", Validators.required]

  })

  register(){
    if(this.formRegister.invalid) {
      this.toast.error('Por favor, rellena todos los campos.');
      return
    }
    this.dissappearButton = false;
    this.authService.register(this.formRegister.value).subscribe({
      next:(response) => {
        const successMessage = response.message; 
        this.router.navigate(['/login']);
        this.toast.success(successMessage);
      },
      error:(error) => {
        const errorMessage = error.error.message;
        this.toast.error(errorMessage);
      }
    })
  }



}
