import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonSearchbar, IonItem, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonSearchbar, IonToolbar, IonHeader]
})
export class NotificationsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
