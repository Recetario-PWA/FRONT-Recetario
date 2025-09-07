import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonSelect ,IonHeader, IonToolbar, IonButton, IonItem, IonInput, IonInputPasswordToggle, IonSelectOption, IonButtons, IonBackButton, IonFooter, IonLabel, IonItemGroup, IonRow, IonListHeader, IonList, IonGrid } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonGrid, IonList, IonRow, IonItemGroup, IonLabel, IonBackButton, IonButtons, IonInput, IonItem, IonButton, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonInputPasswordToggle, IonSelect, IonSelectOption, RouterModule]
})
export class RegisterPage implements OnInit {

  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: ' ¡Registro completo!',
      message: '¡Bienvenido a la comunidad! Ahora solo necesitas verificar tu correo electrónico para empezar.',
      buttons: [
        {
          text: '¡Entendido!',
          handler: () => {
            this.router.navigateByUrl('/auth/login');
          }
        }
      ]
    });

    await alert.present();
  }
}
