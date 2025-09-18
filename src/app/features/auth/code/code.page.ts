import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonInputOtp, IonToolbar, IonButtons, IonBackButton, IonGrid, IonLabel, IonRow, IonList, IonItemGroup, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-code',
  templateUrl: './code.page.html',
  styleUrls: ['./code.page.scss'],
  standalone: true,
  imports: [RouterModule, IonInputOtp, IonButton, IonItemGroup, IonList, IonRow, IonLabel, IonGrid, IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class CodePage implements OnInit {
  email!: string
  constructor() { }

  ngOnInit() {
    const { email } = history.state;

    this.email = email;
    console.log(email);
  }

}
