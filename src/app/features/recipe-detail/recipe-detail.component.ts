import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ModalController, IonContent, IonText, IonIcon, IonRow, IonGrid, IonCol, IonButton, IonList, IonItem, IonLabel, IonAvatar, IonButtons, IonToolbar, IonHeader, IonModal, IonSearchbar, IonImg, IonFab, IonFabButton, IonBackButton, IonTitle, IonChip, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, InfiniteScrollCustomEvent, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { heartOutline, timeOutline, restaurantOutline, chatbubbleOutline } from 'ionicons/icons';
import { StarRatingComponent } from "src/app/shared/components/star-rating/star-rating.component";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonInfiniteScroll, IonInfiniteScrollContent, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent, IonChip, IonTitle, IonBackButton, IonFab, IonImg, IonSearchbar, IonModal, IonHeader, IonToolbar, IonButtons, IonAvatar, IonLabel, IonItem, IonList, IonButton, IonCol, IonGrid, IonRow, IonIcon, IonText, CommonModule, IonContent, IonFabButton, StarRatingComponent]
})
export class RecipeDetailComponent  implements OnInit {
  items: any[] = [];
  selectedRating!: number;

  constructor(private el: ElementRef) { 
    addIcons({ heartOutline, timeOutline, restaurantOutline, chatbubbleOutline });
  }

  ngOnInit() {
    this.generateItems();
  }

  onRatingChange(rating: number) {
    this.selectedRating = rating;
    console.log('Nueva calificación:', rating);
  }

  private generateItems() {
    const count = this.items.length + 1;

    for (let i = 0; i < 5; i++) {
      this.items.push({
        user: `Usuario ${count + i}`,
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
      });
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.generateItems();
      event.target.complete();
    }, 500);
  }

  ngOnDestroy(){}
}
