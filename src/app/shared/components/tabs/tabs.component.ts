import { Component, computed, effect, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonIcon, IonTabBar, IonTabButton, IonTabs, IonBadge, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, personOutline, notificationsOutline, home, heart, person, notifications, restaurantOutline, restaurant } from 'ionicons/icons';
import { Auth } from 'src/app/core/services/auth';
import { Notifications } from 'src/app/core/services/notifications';
import { PushService } from 'src/app/core/services/push';
import { User } from 'src/app/core/services/user';
import { currentUser } from 'src/app/core/stores/auth.store';
import { notifications as notis } from 'src/app/core/stores/auth.store';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonBadge,  IonTabs, IonTabButton, IonTabBar, IonIcon ]
})
export class TabsComponent  implements OnInit {
  user = computed(() => currentUser());

  hasUnreadNotifications = computed(() => 
    notis()?.some((n: any) => !n.read_at) ?? false
  );

  isTabActive(tabName: string): boolean {
    return this.router.url.includes(`/tabs/${tabName}`);
  }

  constructor(private router: Router, private notificationService: Notifications) { 
    addIcons({ homeOutline, heartOutline, personOutline, notificationsOutline, home, heart, person, notifications, restaurantOutline, restaurant });
      
    effect(() => {
      const user = this.user();

      if (user?.id) {
        this.notificationService.subscribeToUserNotifications(user.id);
        //this.pushNotifications.init(user.id.toString());
      }
    })
  }

  ngOnInit() {
  }

  goToCreateEditRecipe() {
    this.router.navigateByUrl('/tabs/recipe/add'); 
  }
}
