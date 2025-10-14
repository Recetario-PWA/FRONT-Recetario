import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonSearchbar, IonItem, IonLabel, IonContent, IonList, IonListHeader, IonAvatar, IonText, IonThumbnail, IonBadge, IonIcon, IonButton, IonSkeletonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { heart, notificationsOffOutline, notificationsOutline } from 'ionicons/icons';
import { TimeAgoPipe } from 'src/app/core/pipes/time-ago-pipe';
import { User } from 'src/app/core/services/user';
import { approveNotifications, notifications, notificationsLoading } from 'src/app/core/stores/auth.store';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [TimeAgoPipe, IonSkeletonText, IonButton, IonIcon, IonText, IonAvatar, IonListHeader, IonList, IonContent, IonLabel, IonItem, IonToolbar, IonHeader, IonThumbnail]
})
export class NotificationsComponent  implements OnInit {
  allComments = computed(() => notifications());
  allApprove = computed(() => approveNotifications());
  loading = computed(() => notificationsLoading());
  skeletons = Array(4).fill(0);
  loadingMarkAll = signal(false);

  groupedComments = computed(() => {
    const today = new Date().toDateString();
    const todayComments: any[] = [];
    const olderComments: any[] = [];

    for (const comment of notifications()) {
      const commentDate = new Date(comment.created_at).toDateString();
      if (commentDate === today) {
        todayComments.push(comment);
      } else {
        olderComments.push(comment);
      }
    }

    todayComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    olderComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { today: todayComments, older: olderComments };
  });

  icons: Record<string, string> = {
    'femenino': 'assets/img/avatarF.png',
    'masculino': 'assets/img/avatarM.png',
    '39 tipos de gays': 'assets/img/avatarG.png'
  }

  constructor(private userService: User, private router: Router) { 
    addIcons({ heart, notificationsOutline, notificationsOffOutline });
  }

  ngOnInit() {}

  markAllAsRead() {
    this.loadingMarkAll.set(true);

    this.userService.markAllAsRead().subscribe({
      next: () => {
        this.userService.getNotifications();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loadingMarkAll.set(false);
      }
    });
  }
  
  markAsRead(comment: any) {
    if (!comment.read_at) {
      this.userService.markAsRead(comment.id).subscribe({
        next: () => {
          comment.read_at = new Date().toISOString();
          this.userService.getNotifications();
        },
        error: (error) => {
          console.error(error);
        }
      });
    }

   if (comment.data.type === 'COMMENT') {
     this.router.navigate(['/recipe-detail', comment.data.recipe.id], {
        queryParams: { commentId: comment.data.id }
      });
   }
  }

  getIcon(comment: any): string {
    const genderKey = comment.data.user?.gender?.toLowerCase() ?? 'default';
    
    return this.icons[genderKey] ?? 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }
}
