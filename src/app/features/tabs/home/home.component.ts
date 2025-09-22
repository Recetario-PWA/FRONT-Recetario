import { Component, computed, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonText, IonIcon, IonItem, IonSearchbar, IonCardSubtitle, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonThumbnail, IonImg, IonAccordion, IonRow, IonCol, IonAvatar, IonGrid, IonList, IonSkeletonText, IonButton, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sunnyOutline, cloudOutline, moonOutline } from 'ionicons/icons';
import { RecipeCardComponent } from '../components/recipe-card/recipe-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Recipe } from 'src/app/core/services/recipes/recipe';
import { take, timeout } from 'rxjs';
import { currentUser, userInfoLoading } from 'src/app/core/stores/auth.store';
import { Auth } from 'src/app/core/services/auth';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonSkeletonText,
    CommonModule,
    IonAvatar,
    IonCol,
    IonRow,
    IonSearchbar,
    IonItem,
    IonIcon,
    IonText,
    IonLabel,
    IonContent,
    IonToolbar,
    IonHeader,
    IonCard,
    IonThumbnail,
    RecipeCardComponent, 
    RouterModule,
    IonSkeletonText,
    IonThumbnail
  ],
})
export class HomeComponent implements OnInit {
  greeting: string = '';
  greetingIcon: string = '';
  loading = signal(true);
  skeletons = Array(4).fill(0);
  recipes = signal<any[]>([]);
  searchBar = signal('');
  userLoading = computed(() => userInfoLoading());
  public user = computed(() => currentUser());

  filteredRecipes = computed(() => {
    const normalize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const text = normalize(this.searchBar().trim());
    const allRecipes = this.recipes() as any[];
    
    if (!text) return allRecipes;

    return allRecipes.filter(recipe => normalize(recipe.title).includes(text));
  });

  title = computed(() => {
    const text = this.searchBar().trim();
    const resultsCount = this.filteredRecipes().length;

    if (!text) {
      return 'Todas las recetas';
    } else if (resultsCount === 0) {
      return 'No hay resultados';
    } else if (resultsCount === 1) {
      return '1 resultado encontrado';
    } else {
      return `${resultsCount} resultados encontrados`;
    }
  });

  icons: Record<string, string> = {
    'femenino': 'assets/img/avatarF.png',
    'masculino': 'assets/img/avatarM.png',
    '39 tipos de gays': 'assets/img/avatarG.png'
  }

  constructor(private recipeService: Recipe, private authService: Auth) {
    addIcons({ sunnyOutline, cloudOutline, moonOutline });
  }

  ngOnInit() {
    this.setGreeting();
    //this.authService.getUserInfo();
    this.getRecipes();
  }

  setGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Buenos días';
      this.greetingIcon = 'sunny-outline';
    } else if (hour >= 12 && hour < 19) {
      this.greeting = 'Buenas tardes';
      this.greetingIcon = 'cloud-outline';
    } else {
      this.greeting = 'Buenas noches';
      this.greetingIcon = 'moon-outline';
    }
  }

  getRecipes() {
    this.recipeService.getAllRecipes().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
          if (response.result) {
          const recipesWithScore = response.data.map((recipe: any) => ({
            ...recipe,
            averageScore: this.calculateTotalScore(recipe)
          }));

          this.recipes.set(recipesWithScore);
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

  getIcon(): string {
    const user = this.user();
    const genderKey = user?.gender?.toLowerCase() ?? 'default';
    return this.icons[genderKey] ?? 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.getRecipes();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
