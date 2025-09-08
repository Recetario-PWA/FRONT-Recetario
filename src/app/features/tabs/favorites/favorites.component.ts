import { Component, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonIcon, IonText, IonAvatar, IonGrid, IonSearchbar, IonContent, IonRow, IonCol, IonCard, IonSkeletonText, IonThumbnail } from "@ionic/angular/standalone";
import { RecipeCardComponent } from "../components/recipe-card/recipe-card.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonCard, IonCol, IonRow, IonSearchbar, IonGrid, IonAvatar, IonText, IonIcon, IonLabel, IonItem, IonBackButton, IonButtons, IonToolbar, IonHeader, IonContent, RecipeCardComponent, IonThumbnail]
})
export class FavoritesComponent  implements OnInit {
  loading = signal(true);
  skeletons = Array(6).fill(0);
  favRecipes: any[] = [];

  constructor() { }

  ngOnInit() {}

}
