import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonImg, IonIcon, IonText, IonButtons,IonTextarea, IonList, IonInput, IonSpinner, IonBackButton, IonSkeletonText, LoadingController, AlertController, NavController } from "@ionic/angular/standalone";
import { SensorCamera } from 'src/app/core/services/sensor-camera';
import { addIcons } from 'ionicons';
import { imageOutline, imagesOutline, cameraOutline, trashOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/core/services/recipes/recipe';
import { take, timeout, TimeoutError } from 'rxjs';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';
import { allRecipes, userRecipes } from 'src/app/core/stores/recipes.store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ErrorMessagesComponent, IonSkeletonText,IonButtons, IonBackButton, IonSpinner, IonInput, IonList, IonTextarea, IonText, IonIcon, IonImg, IonButton, CommonModule, FormsModule, ReactiveFormsModule, IonLabel, IonItem, IonContent, IonTitle, IonToolbar, IonHeader],
})
export class AddRecipeComponent  implements OnInit {
  photo: any | null = null;
  loading = signal(false);
  loadinInfo = signal(false);
  isEditMode = signal(false);
  sendingInfo = signal(false);
  recipeId: string | null = null;
  pageTitle = signal('Publicar receta');
  btnText = signal('Publicar');
  recipeForm: FormGroup;
  recipeInfo: any = {};

  constructor(private fb: FormBuilder, private recipeService: Recipe, private camService: SensorCamera, private zone: NgZone, private route: ActivatedRoute, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private navCtrl: NavController) {
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
      const blob = await this.camService.takePhoto();
      if (!blob) return;

      this.photo = blob; 
      this.recipeForm.patchValue({ image_path: blob });
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
      const blob = await this.camService.pickFromGallery();
      if (!blob) return;

      this.photo = blob;
      this.recipeForm.patchValue({ image_path: blob });
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

  async onSubmit() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    this.sendingInfo.set(true);

    const data = this.recipeForm.value;
    const formData = new FormData();

    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined && key !== 'image_path') {
        formData.append(key, data[key]);
      }
    }

  if (this.photo) {
    let photoBlob: Blob | null = null;

    if (this.photo instanceof Blob) {
      photoBlob = this.photo;
    } else if (typeof this.photo === 'string' && this.photo.startsWith('data:image')) {
      photoBlob = this.base64ToBlob(this.photo);
    }

    if (photoBlob) {
      formData.append('photo', photoBlob, 'recipe.jpg');
    }
  }

    if (this.isEditMode()) {
      const loadingPut = await this.loadingCtrl.create({
        message: 'Actualizando receta...',
        spinner: 'crescent'
      });
      await loadingPut.present();

      this.recipeService.editRecipe(this.recipeId, formData).pipe(timeout(15000), take(1)).subscribe({
        next: async (response) => {
          this.sendingInfo.set(false);
            if (response.result) {
              this.getRecipes();
              this.getUserRecipes();
              await loadingPut.dismiss();
              this.putRecipeAlert(response.data.id);
            }
        },
        error: async (error: HttpErrorResponse | TimeoutError) => {
          if (error instanceof TimeoutError) {
            this.onSubmit();
            return;
          }

          const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
          this.errorAlert(msg);

          this.sendingInfo.set(false);
          await loadingPut.dismiss();
          console.log('Error al guardar receta:', error);
        }
      });
    } else {
      const loadingPost = await this.loadingCtrl.create({
        message: 'Publicando receta...',
        spinner: 'crescent'
      });
      await loadingPost.present();

      this.recipeService.newRecipe(formData).pipe(timeout(15000), take(1)).subscribe({
        next: async (response) => {
          this.sendingInfo.set(false);
            if (response.result) {
              this.photo = null;
              this.getRecipes();
              this.getUserRecipes();
              this.recipeForm.reset();
              await loadingPost.dismiss();
              this.postRecipeAlert(response.data.id);
            }
        },
        error: async (error: HttpErrorResponse | TimeoutError) => {
          if (error instanceof TimeoutError) {
            this.onSubmit();
            return;
          }

          const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
          this.errorAlert(msg);

          this.sendingInfo.set(false);
          await loadingPost.dismiss();
          console.log('Error al guardar receta:', error);
        }
      });
    }
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

  async postRecipeAlert(id: any) {
    const alert = await this.alertCtrl.create({
      header: '¡Receta publicada con éxito!',
      message: '¿Deseas seguir editando la receta o ver sus detalles?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Publicar otra receta',
          role: 'cancel',
        },
        {
          text: 'Ver detalles',
          role: 'confirm',
          handler: () => {
            this.navCtrl.navigateForward(['/recipe-detail/', id]);
          },
        },
      ],
    });

    await alert.present();
  }

  async errorAlert(message: any) {
    const alert = await this.alertCtrl.create({
      header: '¡Ups! Ocurrió un problema',
      message: message || 'Algo salió mal al publicar tu receta. Por favor intenta de nuevo más tarde.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
        }
      ],
    });

    await alert.present();
  }

  async putRecipeAlert(id: any) {
    const alert = await this.alertCtrl.create({
      header: '¡Receta actualizada con éxito!',
      message: 'Tu receta ha sido guardada. ¿Quieres seguir ajustando los detalles o ver cómo quedó?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Seguir editando',
          role: 'cancel',
        },
        {
          text: 'Ver receta',
          role: 'confirm',
          handler: () => {
            this.navCtrl.navigateForward(['/recipe-detail/', id]);
          },
        },
      ],
    });

    await alert.present();
  }

  calculateTotalScore(recipe: any): number {
    if (!recipe.comments || !Array.isArray(recipe.comments) || recipe.comments.length === 0) {
      return 0;
    }

    const validScores = recipe.comments.map((comment: any) => {
      const score = Number(comment.score);
      return isNaN(score) ? null : score;
    }).filter((score: any) => score !== null);

    if (validScores.length === 0) return 0;

    const totalScore = validScores.reduce((sum: any, score: any) =>sum + score, 0);
    const averageScore = totalScore / validScores.length;

    return parseFloat(averageScore.toFixed(1));
  }

  getRecipes() {
    this.recipeService.getAllRecipes().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
          if (response.result) {
          const recipesWithScore = response.data.map((recipe: any) => ({
            ...recipe,
            averageScore: this.calculateTotalScore(recipe)
          }));

          allRecipes.set(recipesWithScore);
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.log(error);
        this.loading.set(false);
      }
    });
  }

  getUserRecipes() {
    this.recipeService.userRecipes().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const recipesWithScore = response.data.map((recipe: any) => ({
            ...recipe,
            averageScore: this.calculateTotalScore(recipe)
          }));
          
          userRecipes.set(recipesWithScore);
          this.loading.set(false);
        } else {
          userRecipes.set([]);
          this.loading.set(false);
        }
      },
      error: (error) => {
        userRecipes.set([]);
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  ionViewWillLeave () {
    this.recipeForm.reset();
    this.photo = null;
  }
}
