import { Component } from '@angular/core';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']

})

export class AnalyticsComponent {
  selectedReportType: string = 'products';
  analyticsData: any[] = []; // This will hold the fetched analytics data.

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.generateAnalyticsData();
  }

  onReportTypeChange() {
    this.generateAnalyticsData();
  }

  generateAnalyticsData() {
    const purchases = this.purchaseService.getAllPurchases();

    if (this.selectedReportType === 'products') {
      // Group by product and sum the spendings
      const groupedData = {};
      purchases.forEach(purchase => {
        if (!groupedData[purchase.productName]) {
          groupedData[purchase.productName] = {
            productName: purchase.productName,
            sales: 0
          };
        }
        groupedData[purchase.productName].sales += Number(purchase.spending) || 0;
      });
      this.analyticsData = Object.values(groupedData);

    } else if (this.selectedReportType === 'customers') {
      // Group by customer and sum the spendings
      const groupedData = {};
      purchases.forEach(purchase => {
        if (!groupedData[purchase.customerName]) {
          groupedData[purchase.customerName] = {
            customerName: purchase.customerName,
            spending: 0
          };
        }
        groupedData[purchase.customerName].spending += Number(purchase.spending) || 0;
      });
      this.analyticsData = Object.values(groupedData);
    }
}
}