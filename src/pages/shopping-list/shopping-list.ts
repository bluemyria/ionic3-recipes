import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Ingredient } from '../../models/ingredient.model';
import { PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { SLOptionsPage } from './sl-options/sl-options';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(private shoppingListService: ShoppingListService, private popoverCtrl: PopoverController, private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  onAddItem(form: NgForm) {
    this.shoppingListService.addItem(form.value.ingredientName, form.value.amount);
    this.loadItems();
    form.reset();
  }

  onCheckItem(index: number) {
    this.shoppingListService.removeItem(index);
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    const popover = this.popoverCtrl.create(SLOptionsPage);
    popover.present({ ev: event });
    popover.onDidDismiss(
      data => {
        if (!data) return;
        if (data.action == 'load') {
          loading.present();
          this.authService.getActiveUser().getIdToken()
            .then(
              (token: string) => {
                this.shoppingListService.fetchList(token)
                  .subscribe(
                    () => {
                      loading.dismiss();
                      this.loadItems()
                    },
                    (error) => {
                      loading.dismiss();
                      console.log(error);
                      this.handleError(error.error.error);
                    }
                  )
              }
            )
        } else if (data.action == 'store') {
          loading.present();
          this.authService.getActiveUser().getIdToken()
            .then(
              (token: string) => {
                this.shoppingListService.storeList(token)
                  .subscribe(
                    () => {
                      loading.dismiss();
                      console.log('success');
                    },
                    error => {
                      loading.dismiss();
                      console.log(error);
                      this.handleError(error.message);
                    }
                  )
              }
            )
        }
      }
    );

  }
  private loadItems() {
    this.listItems = this.shoppingListService.getItems();
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occured',
      message: errorMessage,
      buttons: ['OK']
    });
    alert.present();
  }
}
