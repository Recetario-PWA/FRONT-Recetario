import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonIcon, IonTabBar, IonTabButton, IonTabs, IonBadge, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, personOutline, notificationsOutline, home, heart, person, notifications, restaurantOutline, restaurant } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonBadge,  IonTabs, IonTabButton, IonTabBar, IonIcon ]
})
export class TabsComponent  implements OnInit {
  isTabActive(tabName: string): boolean {
    return this.router.url.includes(`/tabs/${tabName}`);
  }

  constructor(private router: Router) { 
    addIcons({ homeOutline, heartOutline, personOutline, notificationsOutline, home, heart, person, notifications, restaurantOutline, restaurant });
  }

  ngOnInit() {
  }

  goToCreateEditRecipe() {
    this.router.navigateByUrl('/tabs/recipe/add'); 
  }
}
