import { Component, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonText,
  IonIcon,
  IonItem,
  IonSearchbar,
  IonCardSubtitle,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCard,
  IonThumbnail,
  IonImg,
  IonAccordion,
  IonRow,
  IonCol,
  IonAvatar,
  IonGrid,
  IonList, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sunnyOutline, cloudOutline, moonOutline } from 'ionicons/icons';
import { RecipeCardComponent } from '../components/recipe-card/recipe-card.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, 
    IonList,
    IonGrid,
    IonAvatar,
    IonCol,
    IonRow,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonSearchbar,
    IonItem,
    IonIcon,
    IonText,
    IonLabel,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonCard,
    IonThumbnail,
    IonImg,
    IonAccordion,
    RecipeCardComponent,
  ],
})
export class HomeComponent implements OnInit {
  greeting: string = '';
  greetingIcon: string = '';
  username: string = 'User';
  loading = signal(true);
  skeletons = Array(4).fill(0);
  recipes: any[] = [];

  constructor() {
    addIcons({ sunnyOutline, cloudOutline, moonOutline });
  }

  ngOnInit() {
    this.setGreeting();
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
}
