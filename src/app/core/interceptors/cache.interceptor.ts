import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, tap, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Importamos el operador map
import { inject } from '@angular/core';
import { Cache } from '../services/cache';

const CACHABLE_ROUTES = [
  '/api/recipes/favorites',
  '/api/recipes/user-recipes',
  '/api/notifications',
  '/api/comments/history-comments',
  '/api/auth/about-me',
  '/api/recipes/'
];

export const cacheInterceptor: HttpInterceptorFn = (request, next) => {
    const cacheService = inject(Cache);

    if (request.method !== 'GET') {
        return next(request);
    }

    if (!navigator.onLine) {
        return from(cacheService.get(request.urlWithParams)).pipe(
            map(response => {
                if (response) {
                    return new HttpResponse({ body: response, status: 200 });
                }
                
                return new HttpResponse({ body: null, status: 404, statusText: 'Not Found' });
            })
        );
    }


    return next(request).pipe(
        tap(event => {
            if (event instanceof HttpResponse && event.status === 200 && event.body !== null) {
                cacheService.put(request.urlWithParams, event.body);
            }
        })
    );
};