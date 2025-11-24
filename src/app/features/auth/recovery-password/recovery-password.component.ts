import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonContent, IonSelect ,IonHeader, IonToolbar, IonButton, IonItem, IonInput, IonInputPasswordToggle, IonSelectOption, IonButtons, IonBackButton, IonFooter, IonLabel, IonItemGroup, IonRow, IonListHeader, IonList, IonGrid } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { ErrorMessagesComponent } from "src/app/shared/components/error-messages/error-messages.component";
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { codeType } from 'src/app/core/stores/auth.store';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonGrid, IonList, IonRow, IonItemGroup, IonLabel, IonBackButton, IonButtons, IonInput, IonItem, IonButton, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonInputPasswordToggle, IonSelect, IonSelectOption, RouterModule, ErrorMessagesComponent]

})
export class RecoveryPasswordComponent  implements OnInit {
  registerForm: FormGroup;
  loading = signal(false);

  constructor(private alertController: AlertController, private router: Router, private fb: FormBuilder, private authService: Auth) {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    const type = codeType();

    if (type === null || type === '') {
      this.router.navigateByUrl('/auth/login');
    }

    codeType.set(null);
  }

  getControl(name: string): AbstractControl {
    return this.registerForm.controls[name];
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: ' Cambio de contraseña completo!',
      message: '¡Bienvenido de nuevo a la comunidad! Ahora solo necesitas iniciar sesión.',
      backdropDismiss: false,
      buttons: [
        {
          text: '¡Entendido!',
          handler: () => {
            this.router.navigateByUrl('/auth/login');
          }
        }
      ]
    });

    await alert.present();
  }

  onSubmit() {
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }

    const userData = this.registerForm.value;
    this.loading.set(true);

    this.authService.changePassword(userData).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.showAlert();
          this.loading.set(false);
          this.registerForm.reset();
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.onSubmit();
          return;
        }
        console.log(error);

        const httpError = error as HttpErrorResponse;

        const data = httpError.error?.data as Record<string, any> | undefined;

        let msg = '';

        if (data) {
          const validationMessages = ([] as string[]).concat(
            ...Object.values(data)
          );

          if (validationMessages.length > 0) {
            msg = validationMessages.map(err => `* ${err}`).join('\n\n');
          }
        }

        this.errorAlert(msg);

        this.loading.set(false);
        console.log(error);
      }
    });
  }

  async errorAlert(message: any) {
    const alert = await this.alertController.create({
      header: '¡Ups! Ocurrió un problema',
      cssClass: 'multiline-alert',
      message: message || 'Algo salió mal. Por favor intenta de nuevo más tarde.',
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

  ngOnDestroy() {
    this.registerForm.reset();
  }
}
