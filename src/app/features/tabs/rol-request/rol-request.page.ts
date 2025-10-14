import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonTitle, IonToolbar, LoadingController } from '@ionic/angular/standalone';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';
import { User } from 'src/app/core/services/user';
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-rol-request',
  templateUrl: './rol-request.page.html',
  styleUrls: ['./rol-request.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonImg, IonButton, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, ReactiveFormsModule, ErrorMessagesComponent]
})
export class RolRequestPage implements OnInit {
  loading = signal(false);
  requestForm: FormGroup;

  constructor(private fb: FormBuilder, private alertController: AlertController, private userService: User, private loadingCtrl: LoadingController) {
    this.requestForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {}

  getControl(name: string): AbstractControl {
    return this.requestForm.controls[name];
  }

  async onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const data = this.requestForm.value;
    this.loading.set(false);

    const sendingRequest = await this.loadingCtrl.create({
        message: 'Enviando solicitud...',
        spinner: 'crescent'
      });
    await sendingRequest.present();
    
    this.userService.sendRequestRole(data).pipe(timeout(15000), take(1)).subscribe({
      next: async (response) => {
        if (response.result) { 
          await sendingRequest.dismiss();
          this.loading.set(false);
          this.succesAlert();
        }
      },
      error: async (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
            this.onSubmit();
            return;
          }

        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
        this.errorAlert(msg);

        this.loading.set(false);
        await sendingRequest.dismiss();
        console.log('Error al guardar receta:', error);
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

  async succesAlert() {
    const alert = await this.alertController.create({
      header: '¡Solicitud enviada con éxito!',
      cssClass: 'multiline-alert',
      message: 'Tu solicitud ha sido recibida. Un administrador la revisará y te notificaremos la decisión.',
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
}
