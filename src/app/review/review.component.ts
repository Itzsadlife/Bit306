import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PurchaseService } from '../purchase.service';
import { ProductType } from '../product.model';
import { AuthService } from '../auth.service'; // Import the AuthService
import { ReviewService } from '../review.service'; // Assuming you have a separate ReviewService

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  products: ProductType[] = [];
  purchasedProducts: ProductType[] = [];
  showReviewForm: boolean = false;
  reviewSaved: boolean = false;
  selectedRating: string = '';
  reviewComment: string = '';
  formErrors: any = {};
  selectedProduct: ProductType | null = null;


  constructor(
    private purchaseService: PurchaseService,
    private authService: AuthService,
    private reviewService: ReviewService
  ) {}

  // Assume this code is part of your ReviewComponent class

ngOnInit(): void {
  this.fetchPurchasedProducts();
}
fetchPurchasedProducts() {
    const userEmail = this.authService.getUserEmail();
    if (userEmail) {
      this.purchaseService.getPurchasedProductsByUserEmail(userEmail).subscribe(
        (data: any[]) => {
          this.purchasedProducts = data.map(product => {
            // Check if imageUrl exists and is a string to prevent errors
            if (product.imageUrl && typeof product.imageUrl === 'string') {
              const filename = product.imageUrl.split('\\').pop();  // Extract filename from the path
              product.imageUrl = `http://localhost:3000/uploads/${filename}`;  // Transform to URL
            }
            return product;
          });
          console.log('Purchased products:', this.purchasedProducts); // This will log the purchased products data with updated imageUrl
        },
        (error) => {
          console.error('Error fetching purchased products:', error); // This will log any error that occurs during the request
        }
      );
    } else {
      console.error('User email is not defined');
    }
  }

openReviewForm(product: ProductType) {
  this.selectedProduct = product; // Set the selected product
  this.selectedRating = ''; // Reset the selected rating
  this.reviewComment = ''; // Reset the review comment
  this.showReviewForm = true;
}


submitReview(form: NgForm) {
  if (form.valid && this.selectedProduct) {
    const reviewData = {
      productId: this.selectedProduct._id, // Assuming your ProductType has an _id field
      customerEmail: this.authService.getUserEmail(),
      rating: this.selectedRating,
      comment: this.reviewComment
    };

    // Call your review service to save the review
    this.reviewService.saveReview(reviewData).subscribe(
      response => {
        // Handle response
        this.reviewSaved = true;
        this.showReviewForm = false;
        form.resetForm(); // Reset the form after submission
      },
        error => {
          // Handle error
          console.error('Error saving review:', error);
        }
      );
    } else {
      // If the form is not valid, display error messages
      this.formErrors = {
        selectedRating: form.controls['selectedRating'].hasError('required'),
        reviewComment: form.controls['reviewComment'].hasError('required')
      };
    }
  }
}
