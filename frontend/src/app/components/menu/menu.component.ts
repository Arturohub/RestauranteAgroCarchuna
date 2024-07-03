import { Component } from '@angular/core';
import { Menu, MenuOfDay, dish } from '../../interfaces/dish.interface';
import { DishService } from '../../services/dish.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  todayMenu: MenuOfDay | undefined;
  primeros: dish[] = [];
  segundos: dish[] = [];
  postres: dish[] = [];
  today: string = "";
  menuAvailable: boolean = false;
  username: string = "";
  loggedIn: boolean = false;

  showPrimeros: boolean = true;
  showSegundos: boolean = true;
  showPostres: boolean = true;

  loading: boolean = true;

  restaurantClosedMondays: boolean = true;
  restaurantClosedAugust: boolean = true;

  constructor(private menuService: MenuService,
    private dishService: DishService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.today = this.getTodayDate();
    this.checkRestaurantClosedMondays();
    this.checkRestaurantClosedAugust();
    this.getTodayMenu();
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.username = this.authService.getUsername();
    } else {
        this.username = '';
      }
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getTodayMenu(): void {
    this.loading = true;
    this.menuService.getMenuByDate(this.today).subscribe(
      menus => {
        this.loading = false;
        if (menus.length > 0) {
          this.todayMenu = menus[0];
          this.categorizeDishes();
          this.menuAvailable = false;
        } else {
          this.toast.warning('El menú del día aún no se ha publicado. Por favor, espera un poco y en breve lo encontraras aqui');
          this.menuAvailable = true;
        }
      },
      error => {
        this.loading = false;
        let errorMessage = error.error ? error.error : 'Error desconocido';
        this.toast.error(errorMessage);
        this.menuAvailable = true;
      }
    );
  }

  categorizeDishes(): void {
    if (this.todayMenu && this.todayMenu.dishes) {
      this.todayMenu.dishes.forEach(dish => {
        switch (dish.category.toLowerCase()) {
          case 'primero':
            this.primeros.push(dish);
            break;
          case 'segundo':
            this.segundos.push(dish);
            break;
          case 'postre':
            this.postres.push(dish);
            break;
          default:
            this.toast.warning(`Dish ${dish.name} does not have a valid category.`);
        }
      });
    }
  }

  togglePrimeros(): void {
    this.showPrimeros = !this.showPrimeros;
  }

  toggleSegundos(): void {
    this.showSegundos = !this.showSegundos;
  }

  togglePostres(): void {
    this.showPostres = !this.showPostres;
  }

  goToSingleDish(dishId: number): void {
    this.router.navigate(["/dish", dishId])
  }

  goToUpdateMenu(): void {
    if (this.todayMenu) {
      this.router.navigate(['/edit-menu', this.todayMenu.id]);
    }
  }

  private checkRestaurantClosedMondays(): void {
    const today = new Date();
    const day = today.getDay();

    if (day === 1){
      this.restaurantClosedMondays = true;
    }else {
      this.restaurantClosedMondays = false;
    }
  }
  private checkRestaurantClosedAugust(): void {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    if(month === 8 && date >= 1 && date <= 15) {
      this.restaurantClosedAugust = true;
    } else {
      this.restaurantClosedAugust = false;
    }
  }
      
}
