import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../purchase.service';
import { AuthService } from '../auth.service'; // Import AuthService

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  selectedReportType: string = 'products';
  chartData: any[] = [];
  analyticsData: any[] = []; // Array to hold the fetched purchase data

  constructor(
    private purchaseService: PurchaseService,
    private authService: AuthService // Inject AuthService
  ) {}

  // ngOnInit(): void {
  //   this.fetchPurchases(); // Fetch purchases when the component initializes
  // }

 ngOnInit(): void {
    const merchantId = this.authService.getLoggedInMerchantId(); // Get the logged-in merchant's ID
    this.fetchPurchasesForMerchant(merchantId);
  }

  onReportTypeChange() {
    this.generateAnalyticsData(); // Regenerate chart data when report type changes
  }

  fetchPurchases(): void {
    this.purchaseService.getPurchases().subscribe(data => {
      this.analyticsData = data; // Store the fetched data
      this.generateAnalyticsData(); // Process the fetched data for the chart
    }, error => {
      console.error('Error fetching purchase data:', error);
    });
  }

  fetchPurchasesForMerchant(merchantId: string): void {
    this.purchaseService.getPurchasesByMerchant(merchantId).subscribe(data => {
      this.analyticsData = data;
      this.generateAnalyticsData(); // Process this data for the chart
    }, error => {
      console.error('Error fetching purchase data for merchant:', error);
    });
  }
  
  testFetchPurchasesForMerchant(merchantId: string): void {
    this.purchaseService.getPurchasesByMerchant(merchantId).subscribe(data => {
      console.log('Test purchases for merchant:', data); // Log the data for testing
      // Other logic...
    }, error => {
      console.error('Error fetching purchase data for merchant:', error);
    });
  }

  generateAnalyticsData() {
    let groupedData = {};

    if (this.selectedReportType === 'products') {
      // Group by product and sum the sales
      this.analyticsData.forEach(purchase => {
        const productName = purchase.product; // Assuming purchase has a 'product' property
        if (!groupedData[productName]) {
          groupedData[productName] = 0;
        }
        groupedData[productName] += Number(purchase.price) || 0;
      });
    } else if (this.selectedReportType === 'customers') {
      // Group by customer and sum the spending
      this.analyticsData.forEach(purchase => {
        const customerName = purchase.customerName; // Assuming purchase has a 'customerName' property
        if (!groupedData[customerName]) {
          groupedData[customerName] = 0;
        }
        groupedData[customerName] += Number(purchase.price) || 0;
      });
    }

    // Convert the grouped data to the format ngx-charts expects
    this.chartData = Object.entries(groupedData).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }
}

