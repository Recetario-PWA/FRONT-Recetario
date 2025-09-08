import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonItem, IonLabel, IonText, IonIcon, IonImg, IonThumbnail, IonButton } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { timeOutline, star, heart, heartOutline } from 'ionicons/icons';

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
  @Input() cooking_time!: number;
  @Input() image_url!: string;
  @Input() rating!: number;

  constructor() { 
    addIcons({ timeOutline, star, heart, heartOutline });
  }

  ngOnInit() {}

}
