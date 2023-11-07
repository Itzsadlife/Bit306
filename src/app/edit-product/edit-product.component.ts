import { Component, OnInit } from '@angular/core';
import { ProductType } from '../product.model';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: ProductType;
  allProducts: ProductType[] = [];
  currentMerchantID: string;
  constructor(private productService: ProductService, private http: HttpClient, private authService :AuthService) { }

  ngOnInit(): void {
    this.currentMerchantID = this.authService.getLoggedInMerchantId();
    this.http.get<ProductType[]>(`http://localhost:3000/api/products?merchantId=${this.currentMerchantID}`)
    .subscribe(products => {
      // handle the products here
      this.allProducts = products;
    },
      error => {
        // handle the error here
        console.error('Error fetching products for merchant:', error);
     });

  }
  loadProductDetails(event: any) {
    const selectedProductId = event.target.value;
    const selectedProduct = this.allProducts.find(p => p._id === selectedProductId);
    if (selectedProduct) {
      this.product = { ...selectedProduct }; 
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.product.imageUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.productService.updateProduct(this.product);
    this.loadProductDetails({ target: { value: this.product._id } });
  }
}
