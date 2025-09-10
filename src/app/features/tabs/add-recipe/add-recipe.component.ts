import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonImg } from "@ionic/angular/standalone";
import { SensorCamera } from 'src/app/core/services/sensor-camera';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  imports: [IonImg, IonButton, CommonModule, FormsModule, ReactiveFormsModule, IonLabel, IonItem, IonContent, IonTitle, IonToolbar, IonHeader],
})
export class AddRecipeComponent  implements OnInit {
  public photo: string | undefined;

  constructor(private cameraService: SensorCamera) {}

  ngOnInit() {}

  public async takePhoto(): Promise<void> {
    const capturedPhoto = await this.cameraService.takePhoto();
        
    if (capturedPhoto?.webPath) {
      this.photo = capturedPhoto.webPath;
    }
  }
}
