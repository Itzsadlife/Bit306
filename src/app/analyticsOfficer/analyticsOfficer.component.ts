import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analyticsOfficer.component.html',
  styleUrls: ['./analyticsOfficer.component.css']
})
export class AnalyticsOfficerComponent {
  selectedReportType: string = 'products';
  analyticsData: any[] = []; // Array to hold analytics data
  selectedMerchant: string = 'all'; // Initialize with 'all' for all merchants

  merchants: any = {
    all: [
      { productName: 'Product A', sales: 100 },
      { productName: 'Product B', sales: 150 },
      { productName: 'Product C', sales: 80 }
    ],
    merchant1: [
      { productName: 'Merchant 1 Product A', sales: 50 },
      { productName: 'Merchant 1 Product B', sales: 70 }
    ],
    merchant2: [
      { productName: 'Merchant 2 Product A', sales: 30 },
      { productName: 'Merchant 2 Product B', sales: 80 }
    ],
    merchant3: [
      { productName: 'Merchant 3 Product A', sales: 20 },
      { productName: 'Merchant 3 Product C', sales: 80 }
    ]
    // Add more merchants and data as needed
  };

  generateAnalyticsData() {
    // Generate hardcoded analytics data based on the selected report type
    this.analyticsData = this.merchants[this.selectedMerchant];
  

    
    
  }

  // Call the function initially to generate data
  constructor() {
    this.generateAnalyticsData();
  }
  
  onReportTypeChange() {
    console.log('Selected Report Type:', this.selectedReportType);
    this.generateAnalyticsData(); // You can call your data generation method here.
  }
  
  onMerchantChange() {
    console.log(this.selectedMerchant)
    this.generateAnalyticsData();
  }
}
