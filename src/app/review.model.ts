// review.model.ts

export interface Review {
    _id: string;
    productId: string; // Make sure this matches the type of your product's identifier
    customerEmail: string;
    rating: number;
    comment: string;
    createdDate: Date; // Or string, depending on how you handle dates
  }
  