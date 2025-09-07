import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonButtons, IonBackButton, IonGrid, IonRow, IonList, IonItemGroup, IonInput, IonItem, IonSelect, IonSelectOption, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [RouterModule, IonItem, IonInput, IonItemGroup, IonList, IonRow, IonGrid, IonBackButton, IonButtons, IonLabel, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonButton, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
