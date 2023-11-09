// purchase.service.ts
import { Injectable } from '@angular/core';
import { Purchase } from './purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private purchases: any[] = [];

  constructor() { }

  recordPurchase(productName: string, customerName: string, price: number) {
    const newPurchase: Purchase = {
      productName,
      customerName,
      spending: price
    };
    this.purchases.push(newPurchase);
  }
  

  getAllPurchases(): any[] {
    return this.purchases;
  }

  getPurchasesByMerchant(merchantName: string): any[] {
    return this.purchases.filter(p => p.merchantName === merchantName);
  }
}
