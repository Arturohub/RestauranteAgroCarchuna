import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-database-alert',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './database-alert.component.html',
  styleUrl: './database-alert.component.css'
})
export class DatabaseAlertComponent {

}
