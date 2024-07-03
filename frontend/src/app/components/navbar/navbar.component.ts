import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isMenuOpen = false;
  username: string = '';
  userImage: string = '';
  loggedIn: boolean = false;


  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    this.updateAuthStatus();
    this.authService.authStatus.subscribe((loggedIn: boolean) => {
      this.loggedIn = loggedIn;
      this.updateUserDetails();
    });
  }

  updateUserDetails() {
    if (this.loggedIn) {
      this.username = this.authService.getUsername();
      this.userImage = this.authService.getUserImage();
    } else {
      this.username = '';
      this.userImage = '';
    }
  }

  updateAuthStatus() {
    this.loggedIn = this.authService.isLoggedIn();
    this.updateUserDetails();
  }

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
  }

  goToCreateNewDish(): void {
    this.router.navigate(["/create-dish"])
  }
  goToCreateNewMenu(): void {
    this.router.navigate(["/create-menu"])
  }

  goToCheckReservas():void {
    this.router.navigate(["/reservas-admin"])
  }
}
