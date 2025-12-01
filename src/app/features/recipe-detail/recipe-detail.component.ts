import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ModalController, IonContent, IonText, IonIcon, IonRow, IonGrid, IonCol, IonButton, IonList, IonItem, IonLabel, IonAvatar, IonButtons, IonToolbar, IonHeader, IonModal, IonSearchbar, IonImg, IonFab, IonFabButton, IonBackButton, IonTitle, IonChip, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonSkeletonText, IonThumbnail, IonSpinner, AlertController } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { heart, heartOutline, timeOutline, restaurantOutline, chatbubbleOutline } from 'ionicons/icons';
import { take, timeout, TimeoutError } from 'rxjs';
import { Recipe } from 'src/app/core/services/recipes/recipe';
import { addTofavList, removeFromfavList, usefavList } from 'src/app/core/stores/favoriteRecipes.store';
import { StarRatingComponent } from "src/app/shared/components/star-rating/star-rating.component";
import { TimeAgoPipe } from 'src/app/core/pipes/time-ago-pipe';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';
import { allRecipes } from 'src/app/core/stores/recipes.store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonSpinner,IonThumbnail, ErrorMessagesComponent, TimeAgoPipe, ReactiveFormsModule, FormsModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonInfiniteScroll, IonInfiniteScrollContent, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonChip, IonTitle, IonBackButton, IonFab, IonImg, IonSearchbar, IonModal, IonHeader, IonToolbar, IonButtons, IonAvatar, IonLabel, IonItem, IonList, IonButton, IonCol, IonGrid, IonRow, IonIcon, IonText, CommonModule, IonContent, IonFabButton, StarRatingComponent]
})
export class RecipeDetailComponent  implements OnInit {
  recipeId!: number;
  recipe: any = {};
  selectedRating = signal<number>(0);
  ingredientsList: string[] = [];
  instructionsList: string[] = [];
  comments = signal<any[]>([]);
  commentForm: FormGroup;
  loading = signal(false);
  loadingRecipe = signal(true);

  favs = usefavList();
  isInFavList = computed(() => this.favs().includes(this.recipeId));

  icons: Record<string, string> = {
    'femenino': 'assets/img/avatarF.png',
    'masculino': 'assets/img/avatarM.png',
    '39 tipos de gays': 'assets/img/avatarG.png'
  }

  //CALCULAR SCORE TOTAL DE LA RECETA
  averageScore = computed(() => {
    const list = this.comments();
    if (!list.length) return 0;
    const total = list.reduce((acc, comment) => acc + comment.score, 0);
    return parseFloat((total / list.length).toFixed(1));
  });

  constructor(private alertController: AlertController, private fb: FormBuilder, private recipeService: Recipe, private el: ElementRef, private route: ActivatedRoute, private router: Router) { 
    addIcons({ heart, heartOutline, timeOutline, restaurantOutline, chatbubbleOutline });

    this.commentForm = this.fb.group({
      recipe_id: [''],
      info: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      score: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit() {
    this.recipeId = +this.route.snapshot.paramMap.get('id')!;

    this.getRecipe();
  }

  getControl(name: string): AbstractControl {
    return this.commentForm.controls[name];
  }

  toggleFav() {
    if (this.isInFavList()) {
      removeFromfavList(this.recipeId);
    } else {
      addTofavList(this.recipeId);
    }
  }

  onRatingChange(rating: number) {
    this.selectedRating.set(rating);
    this.commentForm.patchValue({ score: rating });
  }

  getRecipe() {
    this.recipeService.getRecipe(this.recipeId).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          //GUARDAR TODA LA RECETA
          this.recipe = response.data;

          //GUARDAR SOLO LOS INGREDIENTES
          this.ingredientsList = this.recipe.ingredients.split(',').map((i: any) => i.trim());

          //GUARDAR SOLO LAS INSTRUCCIONES
          this.instructionsList =  this.recipe.instructions.split('.').map((s: any) => s.trim()).filter((s: any) => s !== '');

          //GUARDAR LOS COMENTARIOS DE LA RECETA
          this.comments.set((this.recipe.comments || []).sort((a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
          
          setTimeout(() => {
            const commentId = this.route.snapshot.queryParamMap.get('commentId');
            if (commentId) {
              const element = document.getElementById(`comment-${commentId}`)?.querySelector('.commentWrapper');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element?.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 2000);
              }
            }
          }, 300);

          this.loadingRecipe.set(false);
        }
      },
      error: async (error: HttpErrorResponse) => {
        if (error.status === 422) {
          const alert = await this.alertController.create({
            header: 'Error',
            message: error.error.msg || 'La receta no existe',
            buttons: ['OK']
          });

          await alert.present();

          this.router.navigateByUrl(this.router.url.split('?')[0]); 
          history.back();
          return;
        }

        console.log(error);
      }
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      event.target.complete();
    }, 500);
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

  //PUBLICAR COMENTARIO
  onSubmit() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.commentForm.patchValue({
      recipe_id: this.recipeId,
    });

    const data = this.commentForm.value;

    this.loading.set(true); 

    this.recipeService.addComment(data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        //ACTUALIZAR LOS COMENTARIOS
        this.getRecipe();
        this.getRecipes();

        this.commentForm.reset();
        this.selectedRating.set(0);
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.onSubmit();
          return;
        }

        const httpError = error as HttpErrorResponse;

        const data = httpError.error?.data as Record<string, any> | undefined;

        let msg = '';

        if (data) {
          const validationMessages = ([] as string[]).concat(
            ...Object.values(data)
          );

          if (validationMessages.length > 0) {
            msg = validationMessages.map(err => `* ${err}`).join('\n\n');
          }
        }

        this.errorAlert(msg);
      },
      complete: () => {
        this.selectedRating.set(0);
        this.loading.set(false);
      }
    });
  }

  async errorAlert(message: any) {
    const alert = await this.alertController.create({
      header: '¡Ups! Ocurrió un problema',
      cssClass: 'multiline-alert',
      message: message || 'Algo salió mal. Por favor intenta de nuevo más tarde.',
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

          //console.log(this.recipes());
        }
      },
      error: (error) => {
        console.log(error);
        this.loading.set(false);
      }
    });
  }

  getIcon(gender?: string): string {
    const genderKey = gender?.toLowerCase() ?? 'default';
    return this.icons[genderKey] ?? 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  ngOnDestroy(){
    this.commentForm.reset();
  }
}
