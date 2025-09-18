import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { IonCard, IonItem, IonLabel, IonText, IonIcon, IonImg, IonThumbnail, IonButton, NavController } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { timeOutline, star, heart, heartOutline } from 'ionicons/icons';
import { take, timeout } from 'rxjs';
import { Recipe } from 'src/app/core/services/recipes/recipe';
import { addTofavList, removeFromfavList, usefavList } from 'src/app/core/stores/favoriteRecipes.store';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonImg, IonIcon, IonText, IonLabel, IonItem, IonCard, IonThumbnail]
})
export class RecipeCardComponent  implements OnInit {
  @Input() recipe_id!: number;
  @Input() title!: string;
  @Input() servings!: number;
  @Input() cooking_time!: string;
  @Input() image_url!: string;
  @Input() rating: number = 0;

  favs = usefavList();
  isInFavList = computed(() => this.favs().includes(this.recipe_id));

  constructor(private navCtrl: NavController) { 
    addIcons({ timeOutline, star, heart, heartOutline });
  }

  toggleFav() {
    if (this.isInFavList()) {
      removeFromfavList(this.recipe_id);
    } else {
      addTofavList(this.recipe_id);
    }
  }

  ngOnInit() {
  }

  goToDetails() {
    this.navCtrl.navigateForward(['/recipe-detail/', this.recipe_id]);
  }
}
