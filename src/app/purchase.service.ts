import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchases: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  // recordPurchase(purchaseData: any): Observable<any> {
  //   // You can make an HTTP request to record the purchase on the backend here
  //   // Replace the following code with an actual HTTP request
  //   // You can define a backend endpoint for recording purchases

  //   // For example, if you have a backend endpoint to record purchases, you can use:
  //   // return this.http.post<any>('http://localhost:3000/api/record-purchase', purchaseData);

  //   // For simplicity, we'll push the purchase data to the local array for demonstration purposes
  //   this.purchases.push(purchaseData);

  //   // Return an observable with a success message (you can customize this)
  //   return new Observable((observer) => {
  //     observer.next({ message: 'Purchase recorded successfully' });
  //     observer.complete();
  //   });
  // }

  recordPurchase(purchaseData: any): Observable<any> {
    this.purchases.push(purchaseData);
  // Send an HTTP POST request to the backend to record the purchase
  console.log(purchaseData);
  return this.http.post<any>('http://localhost:3000/api/purchase', purchaseData);
  
}


  getAllPurchases(): any[] {
    return this.purchases;
  }

  getPurchasesByMerchant(merchantName: string): any[] {
    return this.purchases.filter((p) => p.merchantName === merchantName);
  }

  getPurchasedProductsByUserEmail(userEmail: string): Observable<any[]> {
    
    // Make an HTTP request to your backend to fetch purchased products based on the user's email
    return this.http.get<any[]>(`http://localhost:3000/api/purchases/${userEmail}`);
  }
}
