import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, PopoverController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { RecipePage } from '../recipe/recipe';
import { SLOptionsPage } from '../shopping-list/sl-options/sl-options';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(private navCtrl: NavController, private recipeService: RecipeService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private popoverCtrl: PopoverController, private authService: AuthService) { }

  ionViewWillEnter() {
    this.recipes = this.recipeService.getRecipes();
  }
  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, { mode: 'New' });
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, { recipe: recipe, index: index });
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
                this.recipeService.fetchList(token)
                  .subscribe(
                    () => {
                      loading.dismiss();
                      this.recipes = this.recipeService.getRecipes();
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
                this.recipeService.storeList(token)
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


  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occured',
      message: errorMessage,
      buttons: ['OK']
    });
    alert.present();
  }



}
