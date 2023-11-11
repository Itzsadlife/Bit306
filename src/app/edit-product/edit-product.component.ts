import { Component, OnInit } from '@angular/core';
import { ProductType } from '../product.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  constructor(private http: HttpClient, private authService: AuthService, private snackBar: MatSnackBar) { }
  
ngOnInit(): void {
    this.currentMerchantID = this.authService.getLoggedInUserId();
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
         if (this.allProducts.length > 0) {
      this.loadDefaultProductDetails();
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

  loadDefaultProductDetails() {
  // Load the first product's details by default
  const firstProductId = this.allProducts[0]._id;
  this.loadProductDetailsForSingleProduct(firstProductId);
}

onImageChange(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    this.selectedImage = input.files[0];

    // Create a FileReader to read the selected file
    const reader = new FileReader();

    // Set up an onload event handler to update the imageDisplay property
    // with a data URL representing the selected file
    reader.onload = (e: any) => {
      this.imageDisplay = e.target.result; // This will be a data URL
    }

    // Read the file as a data URL
    reader.readAsDataURL(this.selectedImage);
  } else {
    // If no file is selected, clear the selectedImage and imageDisplay
    this.selectedImage = null;
    this.imageDisplay = null;
  }
}


  onSubmit() {
    console.log("Product ID:", this.product._id);
    const productId = this.product._id; // Get the product ID

    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price.toString());
      formData.append('imageUrl', this.selectedImage);

      this.http.patch(`http://localhost:3000/api/product/edit-product/${productId}`, formData)
        .subscribe(
          (response: any) => {
            console.log('Product updated successfully:', response);
            this.refreshProductList(); // Call refreshProductList here
            this.snackBar.open('Product updated successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          },
          (error) => {
            console.error('Error updating product:', error);
            // Optionally, show an error notification
            this.snackBar.open('Failed to update product.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        )
    }
    else {
      this.http.patch(`http://localhost:3000/api/product/edit-product/${productId}`, this.product)
        .subscribe(
          (response: any) => {
            console.log('Product updated successfully:', response);
            this.refreshProductList(); // Call refreshProductList here
            this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        (error) => {
          console.error('Error updating product:', error);
          // Optionally, show an error notification
          this.snackBar.open('Failed to update product.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
        );
    }
  }
    getImageUrl(product): string {
      const filename = product.imageUrl.split('/').pop();
      return `http://localhost:3000/uploads/${filename}`;
    }

  refreshProductList() {
  this.http.get<ProductType[]>(`http://localhost:3000/api/products?merchantId=${this.currentMerchantID}`)
    .subscribe(products => {
      this.allProducts = products.map(product => {
        // Update imageUrl to avoid browser caching
        product.imageUrl += `?t=${new Date().getTime()}`;
        return product;
      });
    },
    error => {
      console.error('Error fetching products:', error);
    });
  }
  
}
