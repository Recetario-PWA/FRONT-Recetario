import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const exitInterceptor: HttpInterceptorFn = (req, next) => {

const auth = inject(Auth);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        // Usuario eliminado o token inválido
        auth.logout().subscribe(() => {
          router.navigate(['auth/login']);
        });
      }

      return throwError(() => error);
    })
  );
};
