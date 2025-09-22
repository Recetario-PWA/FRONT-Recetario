import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonSkeletonText, IonText, IonThumbnail, IonTitle, IonToolbar, LoadingController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, eyeOutline } from 'ionicons/icons';
import { Comments } from 'src/app/core/services/comments';
import { commentsUser } from 'src/app/core/stores/userComments.store';
import { take, timeout } from 'rxjs';
import { TimeAgoPipe } from 'src/app/core/pipes/time-ago-pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.page.html',
  styleUrls: ['./my-comments.page.scss'],
  standalone: true,
  imports: [TimeAgoPipe, IonThumbnail, IonSkeletonText,IonText, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonItem, IonBackButton, IonButtons, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MyCommentsPage implements OnInit {
  comments = computed(() => commentsUser());
  skeletons = Array(7).fill(0);
  loading = signal(true);

  constructor(private router: Router, private alertCtrl: AlertController, private commentService: Comments, private loadingCtrl: LoadingController) { 
    addIcons({ trashOutline, eyeOutline });
  }

  ngOnInit() {
    this.getComments();
  }

  getComments() {
    this.commentService.getComments().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          commentsUser.set(response.data);
          this.loading.set(false);
        } else {
          commentsUser.set(null);
          this.loading.set(false);
        }
      },
      error: (error) => {
        commentsUser.set(null);
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  goToComment(slidingItem: IonItemSliding, recipeId: number, commentId: number) {
    slidingItem.close();
    this.router.navigate(['/recipe-detail', recipeId], {
      queryParams: { commentId: commentId }
    });
  }

  async deleteItem(commentId: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando comentario...',
      spinner: 'crescent'
    });
    await loading.present();

    this.commentService.deleteComment(commentId).pipe(timeout(15000), take(1)).subscribe({
      next: async (response) => {
        if (response.result) {
          this.getComments();
          await loading.dismiss();
        }
      },
      error: async (error) => {
        await loading.dismiss();
        console.log(error);
      }
    });
  }

  async deleteAlert(slidingItem: IonItemSliding, comment: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este comentario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            slidingItem.close();
          },
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            slidingItem.close();
            this.deleteItem(comment);
          },
        },
      ],
    });

    await alert.present();
  }
}
