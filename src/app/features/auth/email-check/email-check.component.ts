import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonContent, IonSelect ,IonHeader, IonToolbar, IonButton, IonItem, IonInput, IonInputPasswordToggle, IonSelectOption, IonButtons, IonBackButton, IonFooter, IonLabel, IonItemGroup, IonRow, IonListHeader, IonList, IonGrid } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { ErrorMessagesComponent } from "src/app/shared/components/error-messages/error-messages.component";
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { codeEmail, codeType } from 'src/app/core/stores/auth.store';

@Component({
  selector: 'app-email-check',
  templateUrl: './email-check.component.html',
  styleUrls: ['./email-check.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonGrid, IonList, IonRow, IonItemGroup, IonLabel, IonBackButton, IonButtons, IonInput, IonItem, IonButton, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonInputPasswordToggle, IonSelect, IonSelectOption, RouterModule, ErrorMessagesComponent]

})
export class EmailCheckComponent implements OnInit {
  emailForm: FormGroup;
  loading = signal(false);

  constructor(private alertController: AlertController, private router: Router, private fb: FormBuilder, private authService: Auth) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
    });
  }
  
  ngOnInit() {
  }

  getControl(name: string): AbstractControl {
    return this.emailForm.controls[name];
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Cuenta encontrada!',
      message: '¡Se envió un código al correo, verifica el spam si no lo encuentras.',
      backdropDismiss: false,
      buttons: [
        {
          text: '¡Entendido!',
          handler: () => {
            this.router.navigate(['auth/verify-code']);
          }
        }
      ]
    });

    await alert.present();
  }

  onSubmit() {
    codeEmail.set('');
    if(this.emailForm.invalid){
      this.emailForm.markAllAsTouched();
      return;
    }

    const userData = this.emailForm.value;
    this.loading.set(true);

    this.authService.sendCode(userData).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          codeEmail.set(userData.email);
          codeType.set("recovery");
          this.showAlert();
          this.loading.set(false);
          this.emailForm.reset();
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
    this.emailForm.reset();
  }
}
