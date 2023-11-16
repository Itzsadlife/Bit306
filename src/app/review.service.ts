// purchase.service.ts (or review.service.ts if you have one)

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // This import is necessary for Observable


@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private http: HttpClient) { }

  // Method to save a review
  saveReview(reviewData: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/reviews', reviewData);
  }
}
