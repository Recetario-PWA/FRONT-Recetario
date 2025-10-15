import { Injectable, NgZone, signal } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Auth } from './auth';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular/standalone';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class Notifications {
  private echo!: Echo<any>;
  private echoInitialized = false;
  message: string = '';

  constructor(private userService: User, private authService: Auth, private toastCtrl: ToastController) {}

  public subscribeToUserNotifications(userId: number) {

    const token = this.authService.getToken();

    if (!this.echoInitialized) {
      (window as any).Pusher = Pusher;

      this.echo = new Echo({
        broadcaster: 'pusher',
        key: environment.pusher.key,
        cluster: 'us2',
        forceTLS: true,
        authEndpoint: `${environment.apiUrlBase}broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      });

      this.echoInitialized = true;
  }

  //ESTO NOMAS ES PARA DEPURAR
/*if (this.echo && this.echo.connector) {
    const pusher = (this.echo.connector as any).pusher;

    pusher.connection.bind('state_change', (states: any) => {
      console.log('Pusher state change:', states);
    });

    pusher.bind('pusher:subscription_error', (status: number, data: any) => {
      console.log('Pusher subscription error:', status, data);
    });

    (pusher as any).logToConsole = true;
  }*/

  this.echo.private(`App.Models.User.${userId}`).listen('.new.comment', async (event: any) => {
      //console.log('📩 Evento recibido desde Pusher:', event);
      this.userService.getNotifications();
      const message = `💬 ${event.user.user_name} comentó en tu receta "${event.recipe.title}"`;

      await this.presentToast(message);
  });

  this.echo.private(`App.Models.User.${userId}`).listen('.approve.request', async (event: any) => {
    //console.log('📩 Evento recibido desde Pusher:', event);
    this.userService.getNotifications();
    
    if (event.status === 'aprobado') {
      this.message = `🎉 Tu solicitud de cambio de rol ha sido aprobada por el administrador`;
      try {
        window.location.reload();
      } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
      }
    } else if (event.status === 'denegado') {
      this.message = `🚫 Tu solicitud de cambio de rol ha sido rechazada`;
    }

    await this.presentToast(this.message);
  });
}

  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'top',
      swipeGesture: 'vertical',
    });
    await toast.present();
  }
}
