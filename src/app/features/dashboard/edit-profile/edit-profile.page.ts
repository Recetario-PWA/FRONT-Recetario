import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonInput, IonIcon, IonSelect, IonSelectOption, IonButton, IonModal, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonInputPasswordToggle, IonModal, IonSelect, IonSelectOption, IonList, IonIcon, IonInput, IonBackButton, RouterModule, IonAvatar, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonButton]
})
export class EditProfilePage implements OnInit {

  constructor() { 
    addIcons({ closeOutline });
  }

  ngOnInit() {
  }

}
