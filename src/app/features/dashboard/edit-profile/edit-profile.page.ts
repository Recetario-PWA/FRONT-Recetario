import { Component, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonInput, IonIcon, IonSelect, IonSelectOption, IonButton, IonModal, IonInputPasswordToggle, AlertController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { currentUser } from 'src/app/core/stores/auth.store';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';
import { User } from 'src/app/core/services/user';
import { Auth } from 'src/app/core/services/auth';
import { take, timeout } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMessagesComponent, IonInputPasswordToggle, IonModal, IonSelect, IonSelectOption, IonList, IonIcon, IonInput, IonBackButton, RouterModule, IonAvatar, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonButton]
})
export class EditProfilePage implements OnInit {
  public user = computed(() => currentUser());
  updateInfoForm: FormGroup;

  icons: Record<string, string> = {
    'femenino': 'assets/img/avatarF.png',
    'masculino': 'assets/img/avatarM.png',
    '39 tipos de gays': 'assets/img/avatarG.png'
  }

  constructor(private userService: User, private authService: Auth ,private fb: FormBuilder, private alertCtrl: AlertController) { 
    addIcons({ closeOutline });

    this.updateInfoForm = this.fb.group({
      user_name: ['',  [Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[A-Za-z][A-Za-z0-9._]{2,19}$')]],
      name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
    });

    effect(() => {
      const currentUser = this.user();

      if (currentUser) {
        this.updateInfoForm.patchValue({
          user_name: currentUser.user_name,
          name: currentUser.name,
          last_name: currentUser.last_name,
          gender: currentUser.gender,
          email: currentUser.email
        });
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
  }

  getControl(name: string): AbstractControl {
    return this.updateInfoForm.controls[name];
  }

  getIcon(): string {
    const user = this.user();
    const genderKey = user?.gender?.toLowerCase() ?? 'default';
    return this.icons[genderKey] ?? 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  onSubmit() {
    if (this.updateInfoForm.invalid) {
      this.updateInfoForm.markAllAsTouched();
      return;
    }

    const changedData: any = {};
    
    Object.keys(this.updateInfoForm.controls).forEach(key => {
      const control = this.updateInfoForm.get(key);
      if (control?.dirty) {
        changedData[key] = control.value;
      }
    });

    this.userService.updateUser(changedData).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.authService.getUserInfo();
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  async confirmAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar cambios',
      message: '¿Estás seguro de que quieres actualizar tus datos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Si, actualizar',
          role: 'confirm',
          handler: () => {
            this.onSubmit();
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnDestroy() {}
}
