import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(private authService: AuthService,
    private loadController: LoadingController,
    private alertController: AlertController) { }

  onSignin(form: NgForm) {
    let loading = this.loadController.create({
      content: "Logging you in..."
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertController.create({
          title: 'Signin failed',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }
}