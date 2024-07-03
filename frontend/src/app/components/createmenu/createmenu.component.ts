import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Menu, dish } from '../../interfaces/dish.interface';
import { DishService } from '../../services/dish.service';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createmenu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createmenu.component.html',
  styleUrl: './createmenu.component.css'
})
export class CreatemenuComponent {

  dissappearButton: boolean = true;

  menuForm!: FormGroup;
  primeros: dish[] = [];
  segundos: dish[] = [];
  postres: dish[] = [];
  
  constructor(
    private fb: FormBuilder,
    private dishService: DishService,
    private menuService: MenuService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDishes();
  }

  initializeForm(): void {
    this.menuForm = this.fb.group({
      date: ['', Validators.required],
      primeros: [[], Validators.required],
      segundos: [[], Validators.required],
      postres: [[], Validators.required]
    });
  }

  loadDishes(): void {
    this.dishService.getDishesByCategory('Primero').subscribe(data => this.primeros = data);
    this.dishService.getDishesByCategory('Segundo').subscribe(data => this.segundos = data);
    this.dishService.getDishesByCategory('Postre').subscribe(data => this.postres = data);
  }
  
  onSubmit(): void {
    const token = this.authService.getToken();
    if (token) {
      if (this.menuForm.valid) {
        const formValue = this.menuForm.value;
        const allDishes: dish[] = [
          ...formValue.primeros,
          ...formValue.segundos,
          ...formValue.postres
        ];
        const newMenu: Menu = {
          id: 0,
          date: formValue.date,
          dishes: allDishes 
        };
        this.dissappearButton = false;
        this.menuService.createMenu(newMenu, token).subscribe({
          next: (response) => {
            this.toast.success(response)
          },
          error: (error) => {
            if (error.status === 401) {
              this.toast.error("Su sesión ha expirado. Por favor, inicie sesión de nuevo");
            } else {
              const errorMessage = error.error.message;
              this.toast.error(errorMessage);
            }
          }
        })
        this.router.navigate(["/menu"]);
      } else{
        this.toast.error("Por favor, completa todos los campos")
      }
    } else {
      this.toast.error('Logéate para poder crear un nuevo menú!');
    }
  }
}