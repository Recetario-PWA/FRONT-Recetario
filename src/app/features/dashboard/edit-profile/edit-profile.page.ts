import { Component, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonInput, IonIcon, IonSelect, IonSelectOption, IonButton, IonModal, IonInputPasswordToggle, AlertController, IonSkeletonText, IonThumbnail, LoadingController, ModalController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { currentUser, userInfoLoading } from 'src/app/core/stores/auth.store';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';
import { User } from 'src/app/core/services/user';
import { Auth } from 'src/app/core/services/auth';
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMessagesComponent, IonSkeletonText, IonThumbnail, IonInputPasswordToggle, IonModal, IonSelect, IonSelectOption, IonList, IonIcon, IonInput, IonBackButton, RouterModule, IonAvatar, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonButton]
})
export class EditProfilePage implements OnInit {
  public user = computed(() => currentUser());
  loadingUser = computed(() => userInfoLoading());
  updateInfoForm: FormGroup;
  changePasswordForm: FormGroup;

  icons: Record<string, string> = {
    'femenino': 'assets/img/avatarF.png',
    'masculino': 'assets/img/avatarM.png',
    '39 tipos de gays': 'assets/img/avatarG.png'
  }

  constructor(private modalCtrl: ModalController, private userService: User, private authService: Auth ,private fb: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { 
    addIcons({ closeOutline });

    this.updateInfoForm = this.fb.group({
      user_name: ['',  [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[A-Za-z][A-Za-z0-9._]{2,19}$')]],
      name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
    });

    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
    });

    effect(() => {
      const current = this.user();

      if (!current) return;

      this.updateInfoForm.patchValue({
        user_name: current.user_name ?? '',
        name: current.name ?? '',
        last_name: current.last_name ?? '',
        gender: current.gender ?? '',
        email: current.email ?? ''
      });
    });
  }

  ngOnInit() {
  }

  getControl(form: FormGroup, controlName: string) {
    return form.get(controlName);
  }

  getIcon(): string {
    const user = this.user();
    const genderKey = user?.gender?.toLowerCase() ?? 'default';
    return this.icons[genderKey] ?? 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  async onSubmit() {
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

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando información...',
      spinner: 'crescent'
    });
    await loading.present();

    this.userService.updateUser(changedData).pipe(timeout(15000), take(1)).subscribe({
      next: async (response) => {
        if (response.result) {
          this.authService.getUserInfo().subscribe();
          await loading.dismiss();
        }
      },
      error: async (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.onSubmit();
          return;
        }

        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
        this.errorAlert(msg);
        
        await loading.dismiss();
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

  async confirmPasswordAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar cambios',
      message: '¿Estás seguro de que quieres actualizar tu contraseña?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Si, actualizar',
          role: 'confirm',
          handler: () => {
            this.changePasswordSubmit();
          },
        },
      ],
    });

    await alert.present();
  }
  
  async changePasswordSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const data = this.changePasswordForm.value;

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando contraseña...',
      spinner: 'crescent'
    });
    await loading.present();
    
    this.userService.updateUser(data).pipe(timeout(15000), take(1)).subscribe({
      next: async (response) => {
        if (response.result) {
          this.authService.getUserInfo();
          this.changePasswordForm.reset();
          const topModal = await this.modalCtrl.getTop();
          if (topModal) {
            await topModal.dismiss();
          }
          await loading.dismiss();
        }
      },
      error: async (error) => {
        this.changePasswordForm.reset();
        await loading.dismiss();
        console.log(error);
      }
    });
  }

  async errorAlert(message: any) {
    const alert = await this.alertCtrl.create({
      header: '¡Ups! Ocurrió un problema',
      message: message || 'Algo salió mal al publicar tu receta. Por favor intenta de nuevo más tarde.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
        }
      ],
    });

    await alert.present();
  }

  onPasswordModalClose() {
    this.changePasswordForm.reset();
  }

  ngOnDestroy() {
    this.changePasswordForm.reset();
  }
}
