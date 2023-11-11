import { Injectable } from '@angular/core';
import { ProductType } from './product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

productTypes: ProductType[] = [];


  constructor(private http : HttpClient, private authService:AuthService) { }

  getProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>("http://localhost:3000/api/products");
  }

  updateProduct(updatedProduct: ProductType): Observable<ProductType> {
  return this.http.put<ProductType>(`http://localhost:3000/api/product/edit-product/${updatedProduct._id}`,updatedProduct);
  }
  

  addProduct(product: ProductType, image: File): Observable<ProductType> {
    product.merchant_id = this.authService.getLoggedInUserId();
    const productData = new FormData();
    productData.append('name', product.name);
    productData.append('description', product.description);
    productData.append('price', product.price.toString());
    productData.append('imageUrl', image, product.name);
    productData.append('merchant_id',product.merchant_id);
  
    return this.http.post<ProductType>('http://localhost:3000/api/product/add-product', productData);
  }
  
}
