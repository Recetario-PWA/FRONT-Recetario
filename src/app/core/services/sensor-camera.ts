import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class SensorCamera {
  
  constructor() {}

  public async takePhoto(): Promise<Photo | null> {
    try {
      const capturedPhoto = await Camera.getPhoto({
          quality: 100,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          saveToGallery: false,
          allowEditing: false,
          webUseInput: false,
      });
      return capturedPhoto;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }
}
