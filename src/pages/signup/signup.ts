import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private authService: AuthService,
    private loadController: LoadingController,
    private alertController: AlertController) { }

  onSignup(form: NgForm) {
    let loading = this.loadController.create({
      content: "Signing you up..."
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertController.create({
          title: 'Signup failed',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }
}
