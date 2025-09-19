import { CommonModule } from '@angular/common';
import { Component, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonSearchbar, IonHeader, IonLabel, IonToolbar, IonItem, IonContent, IonAvatar, IonText, IonButton, IonList, IonIcon, IonToggle, NavController } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chevronForwardOutline, personOutline, restaurantOutline, settingsOutline, logOutOutline, chatbubblesOutline, moonOutline } from 'ionicons/icons';
import { Auth } from 'src/app/core/services/auth';
import { currentUser } from 'src/app/core/stores/auth.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonToggle, IonIcon, IonList, IonButton, IonText, IonContent, IonItem, IonToolbar, IonHeader, IonLabel, IonAvatar]
})
export class DashboardComponent  implements OnInit {
  paletteToggle = false;
  public user = computed(() => currentUser());

  icons: Record<string, string> = {
    'femenino': 'assets/img/avatarF.png',
    'masculino': 'assets/img/avatarM.png',
    '39 tipos de gays': 'assets/img/avatarG.png'
  }

  constructor(private router: Router, private authServive: Auth, private navCtrl: NavController) {
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


  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  goToPage(page: string) {
    this.router.navigateByUrl(`/dashboard/${page}`);
    //this.navCtrl.navigateForward(['/dashboard/', page]);
  }

  getIcon(): string {
    const user = this.user();
    const genderKey = user?.gender?.toLowerCase() ?? 'default';
    return this.icons[genderKey] ?? 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  logout() {
    this.authServive.logout().subscribe(() => {
      this.navCtrl.navigateForward(['/auth/login']);
    });
  }
}
