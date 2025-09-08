import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  imports: [IonContent, IonTitle, IonToolbar, IonHeader],
})
export class AddRecipeComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
