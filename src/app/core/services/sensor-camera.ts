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
        resultType: CameraResultType.Base64,
      });

      if (!photo.base64String) return null;

      let base64 = photo.base64String;
      let mimeType = `image/${photo.format || 'jpeg'}`;

      if (photo.format?.toLocaleLowerCase() === 'heic' || photo.format?.toLocaleLowerCase() === 'heif' || this.detectFormat(base64) === 'heic' || mimeType === 'image/heif') {
        console.log('Convirtiendo HEIC/HEIF a JPEG');

        base64 = await this.convertHeicToJpeg(base64);
        mimeType = 'image/jpeg';
      }

      let blob = this.base64ToBlob(base64, mimeType);

      blob = await this.resizeBlobImage(blob, 1024, 0.7);

      return blob;

    } catch (err) {
      console.error('Error al tomar/seleccionar foto', err);
      return null;
    }
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: mimeType });
}


  private detectFormat(base64: string): 'heic' | 'jpeg' | 'png' | 'unknown' {
    if (base64.startsWith('/9j/')) return 'jpeg';
    if (base64.startsWith('iVBOR')) return 'png';

    return 'heic';
  }

  private async resizeBlobImage(blob: Blob, maxWidth: number, quality: number): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.src = url;

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

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err)
      };
    });
  }

  private async convertHeicToJpeg(base64: string): Promise<string> {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'image/heic' });

    const jpegBlob = await heic2any({ blob, toType: 'image/jpeg', quality: 0.7 }) as Blob;

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
