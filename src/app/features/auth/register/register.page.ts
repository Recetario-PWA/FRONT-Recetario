import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, IonContent, IonSelect ,IonHeader, IonToolbar, IonButton, IonItem, IonInput, IonInputPasswordToggle, IonSelectOption, IonButtons, IonBackButton, IonFooter, IonLabel, IonItemGroup, IonRow, IonListHeader, IonList, IonGrid } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { ErrorMessagesComponent } from "src/app/shared/components/error-messages/error-messages.component";
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonGrid, IonList, IonRow, IonItemGroup, IonLabel, IonBackButton, IonButtons, IonInput, IonItem, IonButton, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonInputPasswordToggle, IonSelect, IonSelectOption, RouterModule, ErrorMessagesComponent]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  loading = signal(false);

  constructor(private alertController: AlertController, private router: Router, private fb: FormBuilder, private authService: Auth) {
    this.registerForm = this.fb.group({
      user_name: ['',  [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
    },
    { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
  }

  getControl(name: string): AbstractControl {
    return this.registerForm.controls[name];
  }

  private passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { noMatch: true };
  };

  async showAlert() {
    const alert = await this.alertController.create({
      header: ' ¡Registro completo!',
      message: '¡Bienvenido a la comunidad! Ahora solo necesitas verificar tu correo electrónico para empezar.',
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

    this.authService.register(userData).pipe(timeout(15000), take(1)).subscribe({
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
