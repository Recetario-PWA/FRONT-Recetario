import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonCard, IonIcon, IonImg, IonItem, IonLabel, IonText, IonThumbnail } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, star } from 'ionicons/icons';

@Component({
  selector: 'app-my-recipe-card',
  templateUrl: './my-recipe-card.component.html',
  styleUrls: ['./my-recipe-card.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonCard, IonThumbnail, IonImg, IonIcon, IonButton, IonItem, IonLabel, IonText]
})
export class MyRecipeCardComponent  implements OnInit {
  @Input() recipe_id!: number;
  @Input() title!: string;
  @Input() cooking_time!: number;
  @Input() image_url!: string;
  @Input() rating!: number;
  @Output() cardAction = new EventEmitter<any>();

  constructor() { 
    addIcons({ timeOutline, star });
  }

  ngOnInit() {}
  
  onCardClick() {
    this.cardAction.emit(this.recipe_id);
  }
}
