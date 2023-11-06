import { Component, OnInit } from '@angular/core';
import { ProductType } from '../product.model';
import { ProductService } from '../product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
newProduct: ProductType = {
    _id: '',
    merchant_id: '', 
    name: '',
    description: '',
    imageUrl: '',
    price: null
};

  constructor(private productService: ProductService, private snackBar:MatSnackBar, private authService:AuthService) {}

  ngOnInit(): void {}

  onAddProduct() {
    this.productService.addProduct(this.newProduct, this.selectedImage).subscribe(product=>{
      this.snackBar.open('Product added successfully!', 'Close', {
        duration: 3000, 
        horizontalPosition: 'center',
        verticalPosition: 'top',
    });
      this.newProduct = {_id:'', merchant_id : this.authService.getLoggedInMerchantId(), name: '', description: '', imageUrl: '', price:null};  
      this.clearImage();
    }, error=>{
      console.log("Failed to add product", error);
    });
  }
  selectedImage: File | null = null;
  imageDisplay: string | null = null;
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageDisplay = e.target.result;
        this.newProduct.imageUrl = e.target.result;
      }
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.selectedImage = null;
      this.imageDisplay = null;
    }
  }
  
  isFormValid(): boolean {
    return this.newProduct.name && 
           this.newProduct.description &&
           this.newProduct.price &&
           !!this.selectedImage;
  }

  clearImage(): void {
    this.selectedImage = null; 
    this.imageDisplay = '';
    this.newProduct.imageUrl = '';
  }
  
  



}
