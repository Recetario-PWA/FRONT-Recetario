import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonSearchbar, IonHeader, IonLabel, IonToolbar, IonItem, IonContent, IonAvatar, IonText, IonButton, IonList, IonIcon, IonToggle, NavController } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chevronForwardOutline, personOutline, restaurantOutline, settingsOutline, logOutOutline, chatbubblesOutline, moonOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonToggle, IonIcon, IonList, IonButton, IonText, IonContent, IonItem, IonToolbar, IonHeader, IonLabel, IonAvatar]
})
export class DashboardComponent  implements OnInit {
  paletteToggle = false;

  constructor(private router: Router, private navCtrl: NavController) {
    addIcons({ chevronForwardOutline, personOutline, restaurantOutline, settingsOutline, logOutOutline, chatbubblesOutline, moonOutline }); 
  }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark palette based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkPalette(prefersDark.matches);

  // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
  }

    initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  goToPage(page: string) {
    this.router.navigateByUrl(`/dashboard/${page}`);
    //this.navCtrl.navigateForward(['/dashboard/', page]);
  }

  logout() {
    console.log('Se cerro sesion');
  }
}
