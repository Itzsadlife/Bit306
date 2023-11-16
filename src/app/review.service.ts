import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Review } from './review.model'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000'; // This should be the base URL

  constructor(private http: HttpClient) { }

  // Existing method to save a review
  saveReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reviewData);
  }

  // Updated method to get reviews by product ID
  getReviewsByProductId(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/api/reviews/${productId}`);
  }
  
}
