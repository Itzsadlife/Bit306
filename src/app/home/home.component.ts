import { Component, OnInit } from '@angular/core';
import { ProductType } from '../product.model';
import { ProductService } from '../product.service';
import { MatDialog } from '@angular/material/dialog';
import { FirstTimeLoginComponent } from '../FirstTImeLogin/firsttimelogin.component';
import { MerchantService } from '../register.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productTypes: ProductType[] = [];
  isFirstLogin : boolean;

  constructor(private productService: ProductService, public dialog: MatDialog, private merchantService:MerchantService, private http:HttpClient) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      products => {
        this.productTypes = products.map(product => {
          const filename = product.imageUrl.split('\\').pop();  // Extract filename from the path
          product.imageUrl = `http://localhost:3000/uploads/${filename}`;  // Transform to URL
          return product;
        });
        console.log(this.productTypes);
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
    
    const merchantId = this.merchantService.currentMerchantId; 
    this.merchantService.getMerchantDetails(merchantId).subscribe(merchant=>
      {
        this.isFirstLogin = merchant.isFirstLogin;
        console.log(merchantId,this.isFirstLogin);
        if (this.isFirstLogin==true) {
          this.openDialog();
        }
      });
      }

  openDialog(): void {
    const dialogRef = this.dialog.open(FirstTimeLoginComponent, {
      disableClose: true,
      width: '400px'
    });
  }
  getImageUrl(product): string {
    const filename = product.imageUrl.split('/').pop();
    return `http://localhost:3000/uploads/${filename}`;
  }
  
}

