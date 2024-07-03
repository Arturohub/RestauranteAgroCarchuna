import { Component } from '@angular/core';
import { dish } from '../../interfaces/dish.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from '../../services/dish.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-singledish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './singledish.component.html',
  styleUrl: './singledish.component.css'
})
export class SingledishComponent {

  dish: dish | undefined;
  username: string = '';


  constructor(private route: ActivatedRoute,
    private dishService: DishService,
    private authService: AuthService,
    private router: Router, 
    private toast: ToastrService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const dishId = +params['id'];
      this.dishService.getDishById(dishId).subscribe(
        dish => {
          this.dish = dish;
        },
        error => {
          let errorMessage = error.error ? error.error : 'Error desconocido';
          this.toast.error(errorMessage);
        }
      );
    });

    this.username = this.authService.getUsername();
  }

  goToEditDish(dishId: number): void {
    this.router.navigate(["/edit-dish", dishId])
  }
  
  deleteDish(dishId: number): void {
    Swal.fire({title: '¿Estás seguro de que quieres eliminar este plato?', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!', cancelButtonText: 'No, no lo elimines'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = this.authService.getToken();
        if (token) {
          this.dishService.deleteDish(dishId, token).subscribe(
            response => {
              this.toast.success(response);
              this.router.navigate(['/menu']);
            },
            error => {
              let errorMessage = error.error ? error.error : 'Error desconocido';
              this.toast.error(errorMessage);
            }
          );
        }
      }
    });
  }
}