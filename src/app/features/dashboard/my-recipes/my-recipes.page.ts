import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonActionSheet, IonBackButton, IonButtons, IonCol, IonContent, IonHeader, IonItem, IonLabel, IonRow, IonSearchbar, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { RecipeCardComponent } from "../../tabs/components/recipe-card/recipe-card.component";
import { MyRecipeCardComponent } from '../components/my-recipe-card/my-recipe-card.component';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonActionSheet, IonCol, IonRow, IonItem, IonButtons, IonLabel, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MyRecipeCardComponent]
})
export class MyRecipesPage implements OnInit {
  @ViewChild(IonActionSheet) actionSheet!: IonActionSheet;
  isActionSheetOpen = false;
  selectedItem: any;

  public actionSheetButtons = [
    {
      text: 'Ver detalles',
      role: 'view',
      icon: 'eye-outline',
    },
    {
      text: 'Editar',
      role: 'edit',
      icon: 'create-outline'
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      icon: 'trash-outline',
      data: {
        action: 'delete',
      }
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  constructor(private navCtrl: NavController, private alertCtrl: AlertController) {
    addIcons({ trashOutline, createOutline, eyeOutline });
  }

  ngOnInit() {
  }

  openActionSheet(item: any) {
    this.selectedItem = item;
    this.isActionSheetOpen = true;
  }

  setOpen(eventOrBoolean: CustomEvent | boolean) {
    if (typeof eventOrBoolean === 'boolean') {
      this.isActionSheetOpen = eventOrBoolean;
      return;
    }
    
    if (!eventOrBoolean.detail) {
        return;
    }
    
    const role = eventOrBoolean.detail.role;

    this.isActionSheetOpen = false;
    
    if (role === 'view') {
      this.navCtrl.navigateForward(['/recipe-detail/', this.selectedItem]);
    } else if (role === 'edit') {
      this.navCtrl.navigateForward(['/tabs/recipe/', this.selectedItem]);

      console.log('Editando:', this.selectedItem);
    } else if (role === 'destructive') {
      this.deleteAlert();
    } 
  }

  deleteItem() {
    console.log('Eliminando...');
  }

  async deleteAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta receta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.deleteItem();
          },
        },
      ],
    });

    await alert.present();
  }
  
}
