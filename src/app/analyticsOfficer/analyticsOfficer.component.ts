import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analyticsOfficer.component.html',
  styleUrls: ['./analyticsOfficer.component.css']
})
export class AnalyticsOfficerComponent implements OnInit {
  selectedReportType: string = 'products';
  analyticsData: any[] = [];
  selectedMerchant: string = 'all';
  merchantsList: any[] = []; // To store the list of merchants
  chartData: any[] = []; // Data for the chart

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.fetchMerchants();
    this.fetchAnalyticsData();
  }

  fetchMerchants() {
    this.purchaseService.getMerchants().subscribe(data => {
      this.merchantsList = data;
      // Add a 'all' option to view data for all merchants
      this.merchantsList.unshift({ _id: 'all', name: 'All Merchants' });
    });
  }

  fetchAnalyticsData() {
    // Log to check if the method is called
    console.log('fetchAnalyticsData called for report type:', this.selectedReportType);
  
    const fetchData = this.selectedMerchant === 'all' 
      ? this.purchaseService.getAllPurchases()
      : this.purchaseService.getPurchasesByMerchant(this.selectedMerchant);
  
    fetchData.subscribe(data => {
      console.log('Data received from the service:', data); // Log the received data
      this.analyticsData = data;
      this.processDataForChart();
    }, error => {
      console.error('Error fetching data:', error);
    });
  }
  

  processDataForChart() {
    let groupedData = {};
  
    if (this.selectedReportType === 'products') {
      // Aggregate sales by product
      this.analyticsData.forEach(purchase => {
        let key = purchase.product; // Assuming 'product' is the name of the product
        if (!groupedData[key]) {
          groupedData[key] = 0;
        }
        groupedData[key] += Number(purchase.price); // Assuming 'price' is the sales amount for the product
      });
    } else if (this.selectedReportType === 'customers') {
      // Aggregate spending by customer
      this.analyticsData.forEach(purchase => {
        let key = purchase.customerName; // Assuming 'customerName' is the name of the customer
        if (!groupedData[key]) {
          groupedData[key] = 0;
        }
        groupedData[key] += Number(purchase.price); // Assuming 'price' is the amount spent by the customer
      });
    }
  
    // Convert the aggregated data into an array for the chart
    this.chartData = Object.keys(groupedData).map(name => {
      return { name: name, value: groupedData[name] };
    });
  
    console.log('Processed chart data for', this.selectedReportType, ':', this.chartData);
  }
  
  
  


  onReportTypeChange() {
    // Call fetchAnalyticsData if it's needed to fetch new data based on the report type
    this.fetchAnalyticsData();
    // Otherwise, just call processDataForChart to reprocess the current data
    this.processDataForChart();
  }
  

  onMerchantChange() {
    this.fetchAnalyticsData();
  }
}