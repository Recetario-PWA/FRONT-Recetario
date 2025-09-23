import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonContent, IonSelect ,IonHeader, IonToolbar, IonButton, IonItem, IonInput, IonInputPasswordToggle, IonSelectOption, IonButtons, IonBackButton, IonFooter, IonLabel, IonItemGroup, IonRow, IonListHeader, IonList, IonGrid } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { ErrorMessagesComponent } from "src/app/shared/components/error-messages/error-messages.component";
import { take, timeout } from 'rxjs';

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
      user_name: ['',  [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[A-Za-z][A-Za-z0-9._]{2,19}$')]],
      name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
    });
  }

  ngOnInit() {
  }

  getControl(name: string): AbstractControl {
    return this.registerForm.controls[name];
  }

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
      error: (error) => {
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  ngOnDestroy() {
    this.registerForm.reset();
  }
}
