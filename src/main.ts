import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { enableProdMode, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from './environments/environment.prod';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenHandlerInterceptor } from './app/core/interceptors/token-handler.interceptor';
import { cacheInterceptor } from './app/core/interceptors/cache.interceptor';
import { exitInterceptor } from './app/core/interceptors/exit.interceptor';

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    provideHttpClient(withFetch(), withInterceptors([tokenHandlerInterceptor, cacheInterceptor, exitInterceptor])),
  ],
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('✅ SW Beams registrado'))
    .catch(err => console.error('❌ Error registrando SW Beams:', err));
}