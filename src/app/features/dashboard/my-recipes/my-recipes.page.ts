import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonActionSheet, IonBackButton, IonButtons, IonCard, IonCol, IonContent, IonHeader, IonItem, IonLabel, IonRow, IonSearchbar, IonSkeletonText, IonThumbnail, IonTitle, IonToolbar, LoadingController, NavController } from '@ionic/angular/standalone';
import { RecipeCardComponent } from "../../tabs/components/recipe-card/recipe-card.component";
import { MyRecipeCardComponent } from '../components/my-recipe-card/my-recipe-card.component';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline, eyeOutline } from 'ionicons/icons';
import { allRecipes, userRecipes } from 'src/app/core/stores/recipes.store';
import { Recipe } from 'src/app/core/services/recipes/recipe';
import { Router } from '@angular/router';
import { take, timeout } from 'rxjs';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonThumbnail, IonCard, IonSearchbar, IonActionSheet, IonCol, IonRow, IonItem, IonButtons, IonLabel, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MyRecipeCardComponent]
})
export class MyRecipesPage implements OnInit {
  @ViewChild(IonActionSheet) actionSheet!: IonActionSheet;
  loading = signal(true);
  skeletons = Array(6).fill(0);
  isActionSheetOpen = false;
  selectedItem: any;
  recipes = computed(() => userRecipes());
  searchBar = signal('');

  filteredRecipes = computed(() => {
    const normalize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const text = normalize(this.searchBar().trim());
    const allRecipes = this.recipes() as any[];
    
    if (!text) return allRecipes;

    return allRecipes.filter(recipe => normalize(recipe.title).includes(text));
  });

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

  constructor(private loadingCtrl: LoadingController, private navCtrl: NavController, private alertCtrl: AlertController, private recipeService: Recipe, private router: Router) {
    addIcons({ trashOutline, createOutline, eyeOutline });
  }

  ngOnInit() {
    this.getRecipes();
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
      this.deleteAlert(this.selectedItem);
    } 
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

  getAllRecipes() {
    this.recipeService.getAllRecipes().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          allRecipes.set(response.data);
        } else {
          allRecipes.set(null);
        }
      },
      error: (error) => {
        allRecipes.set(null);
        console.log(error);
      }
    });
  }

  async deleteItem(id: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando comentario...',
      spinner: 'crescent'
    });
    await loading.present();

    this.recipeService.deleteRecipe(id).pipe(timeout(15000), take(1)).subscribe({
      next: async (response) => {
        if (response.result) {
          this.getAllRecipes();
          this.getRecipes();
          await loading.dismiss();
        }
      },
      error: async (error) => {
        await loading.dismiss();
        console.log(error);
      }
    });
  }

  async deleteAlert(recipeId: number) {
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
            this.deleteItem(recipeId);
          },
        },
      ],
    });

    await alert.present();
  }
  
}
