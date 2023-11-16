import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProductType } from '../product.model';
import { PurchaseService } from '../purchase.service';
import { ProductService } from '../product.service';
import { NgForm } from '@angular/forms';
import { ReviewService } from '../review.service'; // Adjust the import as necessary

@Component({
  selector: 'app-purchasing',
  templateUrl: './purchasing.component.html',
  styleUrls: ['./purchasing.component.css']
})
export class PurchasingComponent implements OnInit {
  products: ProductType[] = [];
  selectedProductPrice: number = 0;

  showPurchaseForm: boolean = false;
  showPaymentPage: boolean = false;
  bookingSuccessful: boolean = false;
  customerName: string = '';
  customerEmail: string = '';
  selectedProduct: string = '';
  creditCard: string = '';

  

  constructor(
    private location: Location,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: ProductType[]) => {
      this.products = products;
      this.products.forEach(product => {
        this.loadReviewsForProduct(product._id); // Use _id here
      });
    });
    
  }

  purchaseProduct(productName: string) {
    this.selectedProduct = productName;

    const product = this.products.find((p) => p.name === productName);
    if (product) {
      this.selectedProductPrice = product.price;
    }
    this.showPurchaseForm = true;
  }

  submitPurchase() {
    // Make an HTTP request to record the purchase
    const purchaseData = {
      productName: this.selectedProduct,
      customerName: this.customerName,
      paymentAmount: this.selectedProductPrice,
      customerEmail: this.customerEmail,
    };

    this.purchaseService.recordPurchase(purchaseData).subscribe(
      (response) => {
        if (response.message === 'Purchase recorded successfully') {
          this.showPaymentPage = true;
        } else {
          console.log("unable to record")
        }
      },
      (error) => {
        // Handle error responses
      }
    );
  }

  submitPayment() {
    this.bookingSuccessful = true;
  }

  resetComponentState(): void {
    this.selectedProductPrice = 0;
    this.showPurchaseForm = false;
    this.showPaymentPage = false;
    this.bookingSuccessful = false;
    this.customerName = '';
    this.customerEmail = '';
    this.selectedProduct = '';
    this.creditCard = '';
  }

  generateReceipt() {
    // Implement logic to generate and save the receipt (if needed).
    // You can also add additional logic for this function.
    this.bookingSuccessful = true;

    // Reset the component state after the receipt is generated
    this.resetComponentState();
  }

  loadReviewsForProduct(productId: string): void {
    this.reviewService.getReviewsByProductId(productId).subscribe(reviews => {
      const productIndex = this.products.findIndex(p => p._id === productId);
      if (productIndex !== -1) {
        this.products[productIndex].reviews = reviews;
      }
    });
  }
  
}
