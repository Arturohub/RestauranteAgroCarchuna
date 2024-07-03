import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { myUser } from '../../interfaces/myUser.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-userinfo-admin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './userinfo-admin.component.html',
  styleUrl: './userinfo-admin.component.css'
})
export class UserinfoAdminComponent {

  user: myUser | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params["username"];
      const token = this.authService.getToken();
      if (token) {
        this.authService.getUserInformation(username, token).subscribe({
          next: (data) => {
            if (data) {
              this.user = data;
            } else {
              this.user = null;
            }
          },
          error: (error) => {
            this.toast.error("Perdona, no tienes las credenciales necesarias para acceder a este contenido");
            this.user = null;
          }
        });
      } else {
        this.toast.error("Perdona, tienes que registarte o iniciar sesión para poder ver este contenido")
      }
    });
  }
}