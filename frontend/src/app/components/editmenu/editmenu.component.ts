import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { Menu, dish } from '../../interfaces/dish.interface';
import { AuthService } from '../../services/auth.service';
import { DishService } from '../../services/dish.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editmenu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editmenu.component.html',
  styleUrl: './editmenu.component.css'
})
export class EditmenuComponent {

  editMenuForm!: FormGroup;
  menuId!: number;
  primeros: dish[] = [];
  segundos: dish[] = [];
  postres: dish[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dishService: DishService,
    private menuService: MenuService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {}

  
  ngOnInit(): void {
    this.menuId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadDishes();
    this.loadMenu();
  }

  initializeForm(): void {
    this.editMenuForm = this.formBuilder.group({
      date: ['', Validators.required],
      primeros: [[], Validators.required],
      segundos: [[], Validators.required],
      postres: [[], Validators.required]
    });
  }

  populateForm(menu: Menu): void {
    this.editMenuForm.patchValue({
      date: menu.date,
      primeros: menu.dishes.filter(dish => dish.category === "Primero"),
      segundos: menu.dishes.filter(dish => dish.category === "Seguro"),
      postres: menu.dishes.filter(dish => dish.category === "Postre"),
    })
  }

  loadDishes(): void {
    this.dishService.getDishesByCategory('Primero').subscribe(data => this.primeros = data);
    this.dishService.getDishesByCategory('Segundo').subscribe(data => this.segundos = data);
    this.dishService.getDishesByCategory('Postre').subscribe(data => this.postres = data);
  }

  loadMenu(): void {
    this.menuService.getMenuById(this.menuId).subscribe(menu => {
      this.populateForm(menu);
    })

  }

  submitEditMenu(): void {
    const token = this.authService.getToken();
    if (token) {
      if (this.editMenuForm.valid) {
        const formValue = this.editMenuForm.value;
        const allDishes: dish[] = [
          ...formValue.primeros,
          ...formValue.segundos,
          ...formValue.postres
        ];
        const updatedMenu: Menu = {
          id: this.menuId,
          date: formValue.date,
          dishes: allDishes
        };
        this.menuService.updateMenu(this.menuId, updatedMenu, token).subscribe(
          response => {
            this.toast.success(response);
            this.router.navigate(['/menu']);
          },
          error => {
            let errorMessage = error.error ? error.error : 'Error desconocido';
            this.toast.error(errorMessage);
          }
        );
      } else {
        this.toast.error('Por favor, completa todos los campos');
      }
    } else {
      this.toast.error('Por favor, inicia sesión para poder actualizar el menú');
    }
  }
}