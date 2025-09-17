import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.page.html',
  styleUrls: ['./my-comments.page.scss'],
  standalone: true,
  imports: [IonText, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonItem, IonBackButton, IonButtons, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MyCommentsPage implements OnInit {

  constructor(private alertCtrl: AlertController) { 
    addIcons({ trashOutline });
  }

  ngOnInit() {
  }

  deleteItem() {
    console.log('Eliminando...');
  }

  async deleteAlert(slidingItem: IonItemSliding) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este comentario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            slidingItem.close();
          },
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            slidingItem.close();
            this.deleteItem();
          },
        },
      ],
    });

    await alert.present();
  }
}
