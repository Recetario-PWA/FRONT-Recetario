import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators  } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonButtons, IonBackButton, IonGrid, IonRow, IonList, IonItemGroup, IonInput, IonItem, IonSelect, IonSelectOption, IonInputPasswordToggle, AlertController } from '@ionic/angular/standalone';
import { Route, Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { ErrorMessagesComponent } from 'src/app/shared/components/error-messages/error-messages.component';
import { timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { codeEmail } from 'src/app/core/stores/auth.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ErrorMessagesComponent, IonItem, IonInput, IonItemGroup, IonList, IonRow, IonGrid, IonBackButton, IonButtons, IonLabel, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonButton, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loading = signal(false);

  constructor(private fb: FormBuilder, private authService: Auth, private alertCtrl: AlertController, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
      password: ['', [Validators.required]]      
    });
  }

  ngOnInit() {
  }

  getControl(name: string): AbstractControl {
    return this.loginForm.controls[name];
  }

  //Eventos
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const userData = this.loginForm.value;

    this.loading.set(true);

    this.authService.login(userData).pipe(timeout(15000)).subscribe({
      next: async (response) => {
        //const email = userData.email;
        codeEmail.set(userData.email);

        const result = await this.loginAlert("Credenciales correctas.", response.msg);
        /*if (result === 'confirm') {
          this.router.navigate(['auth/verify-code'], { state: { email } });
        }*/
        if (result === 'confirm') {
          this.router.navigate(['auth/verify-code']);
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.onSubmit();
          return;
        }

        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
        this.loginAlert("Error.", msg);
      },
    });
  }

  async loginAlert(title: string, msg: any): Promise<'confirm' | undefined> {
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
