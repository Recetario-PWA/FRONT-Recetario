import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonImg, IonIcon, IonText, IonButtons,IonTextarea, IonList, IonInput, IonSpinner, IonBackButton, IonSkeletonText } from "@ionic/angular/standalone";
import { SensorCamera } from 'src/app/core/services/sensor-camera';
import { addIcons } from 'ionicons';
import { imageOutline, imagesOutline, cameraOutline, trashOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/core/services/recipes/recipe';
import { take, timeout } from 'rxjs';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ErrorMessagesComponent, IonSkeletonText,IonButtons, IonBackButton, IonSpinner, IonInput, IonList, IonTextarea, IonText, IonIcon, IonImg, IonButton, CommonModule, FormsModule, ReactiveFormsModule, IonLabel, IonItem, IonContent, IonTitle, IonToolbar, IonHeader],
})
export class AddRecipeComponent  implements OnInit {
  photo: string | null = null;
  loading = signal(false);
  loadinInfo = signal(false);
  isEditMode = signal(false);
  sendingInfo = signal(false);
  recipeId: string | null = null;
  pageTitle = signal('Publicar receta');
  btnText = signal('Publicar');
  recipeForm: FormGroup;
  recipeInfo: any = {};

  constructor(private fb: FormBuilder, private recipeService: Recipe, private camService: SensorCamera, private zone: NgZone, private route: ActivatedRoute) {
    addIcons({ imageOutline, imagesOutline, cameraOutline, trashOutline });

    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      ingredients: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      instructions: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      image_path: [null, [Validators.required]],
      prep_time: ['', [Validators.required, Validators.min(1)]],
      servings: ['', [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

  ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('id');

    if (this.recipeId) {
      this.isEditMode.set(true);
      this.loadinInfo.set(true);
      this.pageTitle.set('Editar receta');
      this.btnText.set('Guardar cambios');

      this.getRecipeInfo();
    }
  }

  getControl(name: string): AbstractControl {
    return this.recipeForm.controls[name];
  }

  async takePhoto() {
    this.loading.set(true);
    try {
      const result = await this.camService.takePhoto();
      this.zone.run(() => this.photo = result);
      this.recipeForm.patchValue({ image_path: this.photo });
      this.recipeForm.get('image_path')?.updateValueAndValidity();
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
      this.recipeForm.patchValue({ image_path: this.photo });
      this.recipeForm.get('image_path')?.updateValueAndValidity();
    } catch (err) {
      console.error('Error al seleccionar foto', err);
    } finally {
      this.loading.set(false);
    }
  }

  public deletePhoto() {
    this.photo = null;
    this.recipeForm.patchValue({ image_path: null });
    this.recipeForm.get('image_path')?.updateValueAndValidity();
  }

  getRecipeInfo() {
    this.recipeService.getRecipe(this.recipeId).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.recipeInfo = response.data;
          
          this.recipeForm.patchValue({
            title: this.recipeInfo.title,
            ingredients: this.recipeInfo.ingredients,
            instructions: this.recipeInfo.instructions,
            prep_time: parseInt(this.recipeInfo.prep_time, 10) || 0,
            servings: this.recipeInfo.servings,
            image_path: [this.recipeInfo.image_path, [Validators.required]],
          });

          this.photo = this.recipeInfo.image_path;
          this.loadinInfo.set(false);
        }
      },
      error: (error) => {
        this.loadinInfo.set(false);
        console.log(error);
      }
    });
  }

  onSubmit() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    this.sendingInfo.set(true);

    const data = this.recipeForm.value;
    const formData = new FormData();

    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }

    if (this.photo) {
      if (this.photo.startsWith('data:image')) {
        const blob = this.base64ToBlob(this.photo);
        formData.append('image', blob, 'recipe.jpg');
      } else {
        formData.append('image_path', this.photo);
      }
    }

    console.log('FormData listo:');
    formData.forEach((val, key) => console.log(key, val));
  }

  //CONVERTIR IMAGEN A BASE64
  base64ToBlob(base64DataUrl: string): Blob {
    const parts = base64DataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64 = parts[1];

    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: mime });
  }

  ionViewWillLeave () {
    this.recipeForm.reset();
    this.photo = null;
  }
}
