import { Ingredient } from "../models/ingredient.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";

import { tap } from 'rxjs/operators';

@Injectable()
export class ShoppingListService {
    private ingredients: Ingredient[] = [];

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    addItem(name: string, amount: number) {
        this.ingredients.push(new Ingredient(name, amount));
        console.log(this.ingredients);
    }

    addItems(items: Ingredient[]) {
        this.ingredients.push(...items);
    }

    getItems() {
        return this.ingredients.slice();
    }

    removeItem(index: number) {
        this.ingredients.splice(index, 1);
    }

    storeList(token: string) {
        const userID = this.authService.getActiveUser().uid;
        return this.httpClient.put('https://learn-recipes.firebaseio.com/' + userID + '/shopping-list.json?auth=' + token, this.ingredients);
    }

    fetchList(token: string) {
        const userID = this.authService.getActiveUser().uid;
        return this.httpClient.get('https://learn-recipes.firebaseio.com/' + userID + '/shopping-list.json?auth=' + token)
            .pipe(
                tap((data: any[]) => {
                    if ((data != null) && (data.length > 0)) {
                        this.ingredients = data;
                    } else {
                        this.ingredients = [];
                    }
                })
            );
    }
}