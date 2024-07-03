import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  dissappearButton: boolean = true;

  constructor(private authService: AuthService, 
    private router: Router, 
    private formBuild: FormBuilder, 
    private cookieService: CookieService,
    private toast: ToastrService){}

 
  public formLogin: FormGroup = this.formBuild.group({
    username: ["", Validators.required],
    password:["", Validators.required]
  })

  login(){
    if(this.formLogin.invalid) {
      this.toast.error('Por favor, rellena todos los campos.');
      return
    }
    this.dissappearButton = false;
    this.authService.login(this.formLogin.value).subscribe({
      next:(token: string) => {
        this.authService.setToken(token);
        const username = this.authService.extractUsernameFromToken(token);
        this.router.navigate(['/menu']);
        this.toast.success(`Login ocurrido con éxito! ¡Bienvenido, ${username}!`);
      },
      error:(error) => {
        this.toast.error('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.', error.message);
      }
    })
    }

    register(){
      this.router.navigate(["/register"])
    }

}
