import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonImg, IonIcon, IonText, IonButtons,IonTextarea, IonList, IonInput, IonSpinner, IonBackButton } from "@ionic/angular/standalone";
import { SensorCamera } from 'src/app/core/services/sensor-camera';
import { addIcons } from 'ionicons';
import { imageOutline, imagesOutline, cameraOutline, trashOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  imports: [IonButtons, IonBackButton, IonSpinner, IonInput, IonList, IonTextarea, IonText, IonIcon, IonImg, IonButton, CommonModule, FormsModule, ReactiveFormsModule, IonLabel, IonItem, IonContent, IonTitle, IonToolbar, IonHeader],
})
export class AddRecipeComponent  implements OnInit {
  photo: string | null = null;
  loading = signal(false);
  isEditMode = signal(false);
  recipeId: string | null = null;
  pageTitle = signal('Publicar receta');
  btnText = signal('Publicar');

  constructor(private camService: SensorCamera, private zone: NgZone, private route: ActivatedRoute) {
    addIcons({ imageOutline, imagesOutline, cameraOutline, trashOutline });
  }

  ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('id');

    if (this.recipeId) {
      this.isEditMode.set(true);
      this.pageTitle.set('Editar receta');
      this.btnText.set('Guardar cambios');
      
    }
  }

  async takePhoto() {
    this.loading.set(true);
    try {
      const result = await this.camService.takePhoto();
      this.zone.run(() => this.photo = result);
    } catch (err) {
      console.error('Error al tomar foto', err);
    } finally {
      this.loading.set(false);
    }
  }

  async selectPhoto() {
    this.loading.set(true);
    try {
      const result = await this.camService.pickFromGallery();
      this.zone.run(() => this.photo = result);
    } catch (err) {
      console.error('Error al seleccionar foto', err);
    } finally {
      this.loading.set(false);
    }
  }

  public deletePhoto() {
    this.photo = null;
  }
}
