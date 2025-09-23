import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonInputOtp, IonToolbar, IonButtons, IonBackButton, IonGrid, IonLabel, IonRow, IonList, IonItemGroup, IonButton, NavController } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ErrorMessagesComponent } from "src/app/shared/components/error-messages/error-messages.component";
import { Auth } from 'src/app/core/services/auth';
import { take, timeout } from 'rxjs';
import { User } from 'src/app/core/services/user';
import { codeEmail } from 'src/app/core/stores/auth.store';

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

  constructor(private fb: FormBuilder, private authService: Auth, private userService: User, private navCtrl: NavController, private router: Router) {
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
          this.authService.getUserInfo();

          setTimeout(() => {
            this.navCtrl.navigateForward(['/tabs/home']);
          })
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnDestroy() {
    this.codeForm.reset();
  }
}
