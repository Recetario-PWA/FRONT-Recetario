import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonInputOtp, IonToolbar, IonButtons, IonBackButton, IonGrid, IonLabel, IonRow, IonList, IonItemGroup, IonButton, NavController, AlertController } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ErrorMessagesComponent } from "src/app/shared/components/error-messages/error-messages.component";
import { Auth } from 'src/app/core/services/auth';
import { take, timeout, TimeoutError } from 'rxjs';
import { User } from 'src/app/core/services/user';
import { codeEmail } from 'src/app/core/stores/auth.store';
import { HttpErrorResponse } from '@angular/common/http';
import { PushService } from 'src/app/core/services/push';

@Component({
  selector: 'app-code',
  templateUrl: './code.page.html',
  styleUrls: ['./code.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, IonInputOtp, IonButton, IonItemGroup, IonList, IonRow, IonLabel, IonGrid, IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, ErrorMessagesComponent]
})
export class CodePage implements OnInit {
  email!: any;
  codeForm: FormGroup;
  loading = signal(false);

  constructor(private fb: FormBuilder, private authService: Auth, private userService: User, private navCtrl: NavController, private router: Router, private alertCtrl: AlertController, private pushNotifications: PushService) {
    this.codeForm = this.fb.group({
      email: [''],
      code: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{5}$')]]
    });
  }

  ngOnInit() {
    //const { email } = history.state;
    const email = codeEmail();

    this.email = email;
    codeEmail.set(null);

   /* if (!this.email) {
      this.router.navigateByUrl('/auth/login');
    } */
  }

  getControl(name: string): AbstractControl {
    return this.codeForm.controls[name];
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

  async newCodeAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Se ha enviado un nuevo código',
      message: 'Por favor revisa en tu bandeja de spam si no lo ves en tu bandeja de entrada.',
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

  onSubmit() {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.codeForm.patchValue({
      email: this.email,
    });

    const data = this.codeForm.value;

    this.loading.set(true);

    this.authService.verifyCode(data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.authService.saveToken(response.data.token);
          this.authService.getUserInfo().subscribe(user => {
            if (user?.data?.id) {
              this.pushNotifications.init(user.data.id.toString());
            }
          });

          setTimeout(() => {
            this.router.navigate(['/tabs/home']);
          });
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.onSubmit();
          return;
        }

        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
        this.errorAlert(msg);

        this.loading.set(false);
        console.log(error);
      }
    });
  }

  resendCode() { 
    console.log('resendCode', this.email);
    this.authService.resendCode(this.email).pipe(take(1)).subscribe({
      next: (response) => { 
        this.newCodeAlert();
      },
      error: (error: HttpErrorResponse) => {
        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
        this.errorAlert(msg);
        console.log(error);
      }
    });
  }

  ngOnDestroy() {
    this.codeForm.reset();
  }
}
