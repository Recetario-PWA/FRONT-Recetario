import { Injectable } from '@angular/core';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import heic2any from "heic2any";

@Injectable({
  providedIn: 'root'
})
export class SensorCamera {
  
  constructor() {}

  async takePhoto(): Promise<string | null> {
    return this.getPhoto(CameraSource.Camera);
  }

  async pickFromGallery(): Promise<string | null> {
    return this.getPhoto(CameraSource.Photos);
  }

  private async getPhoto(source: CameraSource): Promise<string | null> {
    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        source,
        resultType: CameraResultType.Base64,
      });

      let base64 = photo.base64String ?? null;
      if (!base64) return null;

      const format = this.detectFormat(base64);
      if (format === 'heic') {
        base64 = await this.convertHeicToJpeg(base64);
      }

      return `data:image/jpeg;base64,${base64}`;
    } catch (err) {
      console.error('Error al tomar/seleccionar foto', err);
      return null;
    }
  }

  private detectFormat(base64: string): 'heic' | 'jpeg' | 'png' | 'unknown' {
    if (base64.startsWith('/9j/')) return 'jpeg';
    if (base64.startsWith('iVBOR')) return 'png';

    return 'heic';
  }

  private async convertHeicToJpeg(base64: string): Promise<string> {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'image/heic' });

    const jpegBlob = await heic2any({ blob, toType: 'image/jpeg', quality: 0.8 }) as Blob;

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(jpegBlob);
    });
  }
}
