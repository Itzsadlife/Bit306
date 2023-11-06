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
  product: ProductType = {} as ProductType;
  allProducts: ProductType[] = [];
  currentMerchantID: string;
  loading: boolean = true;
  selectedImage: File | null = null;
  imageDisplay: string | null = null;


  constructor(private productService: ProductService, private http: HttpClient, private authService: AuthService) { }
  
ngOnInit(): void {
    this.currentMerchantID = this.authService.getLoggedInMerchantId();
    this.http.get<ProductType[]>(`http://localhost:3000/api/products?merchantId=${this.currentMerchantID}`)
    .subscribe(products => {
        this.allProducts = products.map(product => {
            const filename = product.imageUrl.split('\\').pop();
            product.imageUrl = `http://localhost:3000/uploads/${filename}`;
          console.log(product.imageUrl);
            return product;
        });
        this.loading = false;
        
        // If there's only one product, automatically load its details
        if (this.allProducts.length === 1) {
            this.loadProductDetailsForSingleProduct(this.allProducts[0]._id);
        }
    },
    error => {
        console.error('Error fetching products for merchant:', error);
        this.loading = false;
    });
}

loadProductDetailsForSingleProduct(productId: string) {
    const selectedProduct = this.allProducts.find(p => p._id === productId);
    if (selectedProduct) {
        this.product = { ...selectedProduct }; 
    }
}

  loadProductDetails(event: any) {
    const selectedProductId = event.target.value;
    const selectedProduct = this.allProducts.find(p => p._id === selectedProductId);
    if (selectedProduct) {
      this.product = { ...selectedProduct }; 
    }
  }

onImageChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    this.selectedImage = input.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageDisplay = e.target.result;
    }
    reader.readAsDataURL(this.selectedImage);
  } else {
    this.selectedImage = null;
    this.imageDisplay = null;
  }
  console.log(this.selectedImage);
}

onSubmit() {
  // Check if an image is selected
  console.log("Product ID:", this.product._id);
  if (this.selectedImage) {
    // If an image is selected, send it along with the product data
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('imageUrl', this.selectedImage);

    const productId = this.product._id; // Get the product ID

    this.http.patch(`http://localhost:3000/api/product/edit-product/${productId}`, formData)
      .subscribe(
        (response: any) => {
          console.log('Product updated successfully:', response);
          // You can add any success handling logic here
          // Reload the product details to see the updated data
          this.loadProductDetails({ target: { value: productId } });
        },
        (error) => {
          console.error('Error updating product:', error);
          // You can add error handling logic here
        }
      );
  } else {
    // If no new image is selected, send only the product data
    const productId = this.product._id; // Get the product ID

    this.http.patch(`http://localhost:3000/api/product/edit-product/${productId}`, this.product)
      .subscribe(
        (response: any) => {
          console.log('Product updated successfully:', response);
          // You can add any success handling logic here
          // Reload the product details to see the updated data
          this.loadProductDetails({ target: { value: productId } });
        },
        (error) => {
          console.error('Error updating product:', error);
          // You can add error handling logic here
        }
      );
  }
}
    getImageUrl(product): string {
    const filename = product.imageUrl.split('/').pop();
    return `http://localhost:3000/uploads/${filename}`;
  }
}
