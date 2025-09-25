import { Component, effect } from '@angular/core';
import { IonApp, IonRouterOutlet, IonAlert } from '@ionic/angular/standalone';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { Auth } from './core/services/auth';
import { User } from './core/services/user';
import { PushService } from './core/services/push';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, IonAlert],
})
export class AppComponent {

  constructor(private authService: Auth, private userService: User,  private pushNotifications: PushService,private swUpdate: SwUpdate, private alertController: AlertController, private pushNotificationService: PushService) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
      ).subscribe(() => {
        this.showUpdateAlert();
      });

      this.swUpdate.checkForUpdate();
    }
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe(user => {
      if (user?.data?.id) {
        this.pushNotifications.init(user.data.id.toString());
      }
    });
    this.userService.getNotifications();
  }

  async showUpdateAlert() {
    const alert = await this.alertController.create({
      header: '✨ ¡Actualización disponible!',
      message: 'Descubre funciones nuevas y mejoras que harán tu experiencia aún mejor.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Actualizar',
          handler: () => {
            this.swUpdate.activateUpdate().then(() => window.location.reload());
          },
        },
      ],
    });

    await alert.present();
  }
}
