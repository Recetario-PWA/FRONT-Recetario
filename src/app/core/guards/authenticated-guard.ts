import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.getToken()) {
    return true;
  } else {
    router.navigateByUrl('/tabs/home');
    return false;
  }
};
