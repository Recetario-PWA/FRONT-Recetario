import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { starOutline, star } from 'ionicons/icons';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class StarRatingComponent  implements OnInit {
  @Input() starCount: number = 5;
  @Input() rating: number = 0;
  @Output() ratingChanged = new EventEmitter<number>(); 
  stars: number[] = [];

  constructor() { 
    addIcons({ starOutline, star });
  }

  ngOnInit() {
    this.stars = Array(this.starCount).fill(0);
  }

  rate(index: number) {
    this.rating = index + 1;
    
    this.ratingChanged.emit(this.rating);
  }

  getColor(index: number): string {
    if (this.isAboveRating(index)) {
      return 'medium';
    }
    return 'warning';
  }

  isAboveRating(index: number): boolean {
    return index >= this.rating;
  }

}
