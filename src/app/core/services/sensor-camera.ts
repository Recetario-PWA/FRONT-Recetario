import { Injectable } from '@angular/core';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import heic2any from "heic2any";

@Injectable({
  providedIn: 'root'
})
export class SensorCamera {
  
  constructor() {}

  async takePhoto(): Promise<Blob | null> {
    return this.getPhoto(CameraSource.Camera);
  }

  async pickFromGallery(): Promise<Blob | null> {
    return this.getPhoto(CameraSource.Photos);
  }

  private async getPhoto(source: CameraSource): Promise<Blob | null> {
    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        source,
        resultType: CameraResultType.Uri,
      });

      let response = await fetch(photo.webPath!);
      let blob = await response.blob();

      if (photo.format === 'heic') {
        blob = await heic2any({ blob, toType: 'image/jpeg', quality: 0.8 }) as Blob;
      }

      blob = await this.resizeBlobImage(blob, 1024, 0.7);

      return blob;

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

  private async resizeBlobImage(blob: Blob, maxWidth: number, quality: number): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const scale = Math.min(maxWidth / img.width, 1);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (resizedBlob) => {
            if (!resizedBlob) reject('Error al redimensionar la imagen');
            else resolve(resizedBlob);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(err);
    });
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
