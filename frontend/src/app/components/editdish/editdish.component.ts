import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from '../../services/dish.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloudinaryService } from '../../services/cloudinary.service';
import { dish } from '../../interfaces/dish.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editdish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editdish.component.html',
  styleUrl: './editdish.component.css'
})
export class EditdishComponent {

  public formEditDish!: FormGroup;
  public selectedFile: File | null = null;
  public dishId!: number;
  public dish: dish | undefined;

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe(params => {
      this.dishId = +params["id"];
      this.dishService.getDishById(this.dishId).subscribe(
        dish => {
          this.dish = dish;
          this.populateForm(dish);
        },
        error => {
          let errorMessage = error.error ? error.error : 'Error desconocido';
          this.toast.error(errorMessage);
        }
      )
    })
  }

  initializeForm(): void {
    this.formEditDish = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      alergenos: ["", Validators.required],
      image: ""
    });
  }

  populateForm(dish: dish): void {
    this.formEditDish.patchValue({
      name: dish.name,
      description: dish.description,
      category: dish.category,
      alergenos: dish.alergenos,
      image: dish.image
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]
  }

  updateDish(): void {
    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          const imageUrl = response.secure_url;
          this.formEditDish.patchValue({ image: imageUrl });
          this.submitEditDishForm()
        },
        error: (error) => {
          this.toast.error("Error al subir la image. Por favor, inténtalo de nuevo", error);
        }
      });
    } else {
      this.submitEditDishForm();
    }
  }

  submitEditDishForm(): void {
    const token = this.authService.getToken();
    if (token) {
      const dishData = this.formEditDish.value;
      this.dishService.updateDish(this.dishId, dishData, token).subscribe({
        next: (response) => {
          this.toast.success(response);
          this.router.navigate(["/menu"]);
        },
        error: (error) => {
          let errorMessage = error.error ? error.error : 'Error desconocido';
          this.toast.error(errorMessage);
        }
      });
    }
  }
}


