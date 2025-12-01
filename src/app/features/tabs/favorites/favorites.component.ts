import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonIcon, IonText, IonAvatar, IonGrid, IonSearchbar, IonContent, IonRow, IonCol, IonCard, IonSkeletonText, IonThumbnail, IonRefresher, IonRefresherContent, RefresherCustomEvent } from "@ionic/angular/standalone";
import { RecipeCardComponent } from "../components/recipe-card/recipe-card.component";
import { Recipe } from 'src/app/core/services/recipes/recipe';
import { usefavList } from 'src/app/core/stores/favoriteRecipes.store';
import { take, timeout } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonCard, IonCol, IonRow, IonSearchbar, IonRefresher, IonRefresherContent, IonGrid, IonAvatar, IonText, IonIcon, IonLabel, IonItem, IonBackButton, IonButtons, IonToolbar, IonHeader, IonContent, RecipeCardComponent, IonThumbnail]
})
export class FavoritesComponent  implements OnInit {
  loading = signal(true);
  skeletons = Array(6).fill(0);
  favRecipes = usefavList();
  recipes = signal<any[]>([]);
  searchBar = signal('');

  filteredRecipes = computed(() => {
    const normalize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const text = normalize(this.searchBar().trim());
    const allRecipes = this.recipes() as any[];
    
    if (!text) return allRecipes;

    return allRecipes.filter(recipe => normalize(recipe.title).includes(text));
  });

  constructor(private recipeService: Recipe) {
    effect(() => {
      const ids = this.favRecipes();

      if (ids.length === 0) {
        this.recipes.set([]);
        this.loading.set(false);
        return;
      }

      this.getFavorites(ids);
    })
  }

  ngOnInit() {
  }

  getFavorites(ids: number[]) {
    this.recipeService.favorites(ids).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const recipesWithScore = response.data.map((recipe: any) => ({
            ...recipe,
            averageScore: this.calculateTotalScore(recipe)
          }));

          this.recipes.set(recipesWithScore);
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.recipes.set([]);
        this.loading.set(false);
        console.log(error);
      }
    });
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

  handleRefresh(event: RefresherCustomEvent) {
    const ids = this.favRecipes();
    setTimeout(() => {
      this.getFavorites(ids);
      event.target.complete();
    }, 2000);
  }
}
