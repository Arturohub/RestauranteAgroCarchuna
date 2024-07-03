import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatabaseAlertComponent } from '../database-alert/database-alert.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent {

  images = [
    { path: 'presentacion.jpg', description: "Agrocarchuna, un restaurante familiar" },
    { path: 'cocina.jpg', description: "Trabajamos duro para servirte la mejor comida" },
    { path: 'cliente.jpg', description: "La satisfacción de nuestros clientes, nuestro único objetivo" }
  ];

  constructor(private popup: MatDialog
  ){}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((element: any) => {
      const rect = element.getBoundingClientRect();
      const elemTop = rect.top;
      const elemBottom = rect.bottom;


      if (elemTop >= 0 && elemBottom <= window.innerHeight) {
        element.classList.add('visible');
      }
    });
  }

  ngOnInit(): void {
    //this.popupMessage();
  }

  popupMessage(): void {
    this.popup.open(DatabaseAlertComponent)
  }

}