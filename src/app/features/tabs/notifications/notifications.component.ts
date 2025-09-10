import { Component, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonSearchbar, IonItem, IonLabel, IonContent, IonList, IonListHeader, IonAvatar, IonText, IonThumbnail, IonBadge, IonIcon, IonButton, IonSkeletonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { heart, notificationsOutline } from 'ionicons/icons';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonButton, IonIcon, IonText, IonAvatar, IonListHeader, IonList, IonContent, IonLabel, IonItem, IonToolbar, IonHeader, IonThumbnail]
})
export class NotificationsComponent  implements OnInit {
  loading = signal(true);
  skeletons = Array(4).fill(0);
  messages: any[] = [
    { id: 1, user: 'Diego', recipe: 'Tacos', time: 'Justo ahora', read: true },
    { id: 2, user: 'Jess', recipe: 'Rajas con crema y pollo', time: 'Hace 1 hora', read: false },
    { id: 3, user: 'Pau', recipe: 'Tacos', time: 'Hace 12 horas', read: false },
  ]

  constructor() { 
    addIcons({ heart, notificationsOutline });
  }

  ngOnInit() {}

  markAsRead(message: any) {
    message.read = true;
  }
}
