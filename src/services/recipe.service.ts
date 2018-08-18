import { Recipe } from "../models/recipe.model";
import { Ingredient } from "../models/ingredient.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { tap } from "rxjs/operators";

@Injectable()
export class RecipeService {
    private recipes: Recipe[] = [];

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]) {
        this.recipes.push(new Recipe(title, description, difficulty, ingredients));
    }

    getRecipes() {
        return this.recipes.slice();
    }

    updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]) {
        this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
    }

    removeRecipe(index: number) {
        this.recipes.splice(index, 1);
    }

    storeList(token: string) {
        const userID = this.authService.getActiveUser().uid;
        return this.httpClient.put('https://learn-recipes.firebaseio.com/' + userID + '/recipes.json?auth=' + token, this.recipes);
    }

    fetchList(token: string) {
        const userID = this.authService.getActiveUser().uid;
        return this.httpClient.get('https://learn-recipes.firebaseio.com/' + userID + '/recipes.json?auth=' + token)
            .pipe(
                tap((data: any[]) => {
                    if ((data != null) && (data.length > 0)) {
                        for (let item of data) {
                            if (!item.hasOwnProperty('ingredients')) {
                                item.ingredients = []
                            }
                        }
                        this.recipes = data;
                    } else {
                        this.recipes = [];
                    }
                })
            );
    }
}