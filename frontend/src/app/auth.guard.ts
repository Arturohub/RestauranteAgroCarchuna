import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastrService)

  if(authService.isLoggedIn() && authService.getUsername() === "Arturo"){
    return true;
  } else {
    toast.error('Perdona, pero no tienes accesso a estas rutas');
    router.navigate(["/login"]);
    return false;
  }
};
