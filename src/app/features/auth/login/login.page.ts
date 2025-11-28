import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators  } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonButtons, IonBackButton, IonGrid, IonRow, IonList, IonItemGroup, IonInput, IonItem, IonSelect, IonSelectOption, IonInputPasswordToggle, AlertController, IonSpinner, LoadingController } from '@ionic/angular/standalone';
import { Route, Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';
import { timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { codeEmail } from 'src/app/core/stores/auth.store';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, NgxCaptchaModule, ErrorMessagesComponent, IonSpinner, IonItem, IonInput, IonItemGroup, IonList, IonRow, IonGrid, IonBackButton, IonButtons, IonLabel, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonButton, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loading = signal(false);
  siteKey = "6LelfhYsAAAAAHY7NKC7D6fLfh9b_OSEdI5_jEsc";
  lang = 'es-419';

  @ViewChild(ReCaptcha2Component) recaptchaComponent!: ReCaptcha2Component;

  constructor(private fb: FormBuilder, private authService: Auth, private alertCtrl: AlertController, private router: Router, private loadingCtrl: LoadingController) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
      password: ['', [Validators.required]],
      captcha: ['', [Validators.required]]    
    });
  }

  ngOnInit() {
  }

  getControl(name: string): AbstractControl {
    return this.loginForm.controls[name];
  }

  //Eventos
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const userData = this.loginForm.value;

    this.loading.set(true);

    const isLoggingIn = await this.loadingCtrl.create({
        message: 'Iniciando sesión...',
        spinner: 'crescent'
    });
    await isLoggingIn.present();

    this.authService.login(userData).pipe(timeout(15000)).subscribe({
      next: async (response) => {
        //const email = userData.email;
        codeEmail.set(userData.email);
        await isLoggingIn.dismiss();
        const result = await this.loginAlert("Inicio de sesión exitoso!", response.msg);
        /*if (result === 'confirm') {
          this.router.navigate(['auth/verify-code'], { state: { email } });
        }*/
        if (result === 'confirm') {
          this.router.navigate(['auth/verify-code']);
        }
      },
      error: async (error: HttpErrorResponse | TimeoutError) => {
        this.recaptchaComponent.resetCaptcha();

        await isLoggingIn.dismiss();
        if (error instanceof TimeoutError) {
          this.onSubmit();
          return;
        }

        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error';
        this.loginAlert("Ups!", msg);
        this.loading.set(false);
      },
    });
  }

  async loginAlert(title: string, msg: any): Promise<'confirm' | undefined> {
    this.loading.set(false);
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role as 'confirm' | undefined;
  }
}
