import { Component } from '@angular/core';
import { dish } from '../../interfaces/dish.interface';
import { AuthService } from '../../services/auth.service';
import { DishService } from '../../services/dish.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-createnewdish',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './createnewdish.component.html',
  styleUrl: './createnewdish.component.css'
})
export class CreatenewdishComponent {

  dissappearButton: boolean = true;
  public formAddDish!: FormGroup;
  public selectedFile: File | null = null;
  public imageUploaded: string | null = null;

  constructor(
    private authService: AuthService,
    private dishService: DishService,
    private toast: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cloudinaryService: CloudinaryService,
  ) { }


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.formAddDish = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      alergenos: ["", Validators.required],
      image: ""
    });
  }
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUploaded = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

 createNewDish(): void {
    if (this.selectedFile) {
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          const imageUrl = response.secure_url;
          this.formAddDish.patchValue({ image: imageUrl });
          this.submitForm();
        },
        error: (error) => {
          this.toast.error("Image upload failed. Please try again.");
        }
      });
    } else {
      this.submitForm();
    }
  }

  submitForm(): void {
    const token = this.authService.getToken();

    this.dissappearButton = false;

    if (token) {
      const dishData = this.formAddDish.value;
      this.dishService.createDish(dishData, token).subscribe({
        next: () => {
          this.toast.success("Nuevo plato creado con éxito");
          this.router.navigate(["/menu"]);
        },
        error: (error) => { 
          if (error.status === 401) {
            this.toast.error("Su sesión ha expirado. Por favor, inicie sesión de nuevo");
          } else {
            const errorMessage = error.error.message;
            this.toast.error(errorMessage);
          }
        }
      });
    }
  }
}