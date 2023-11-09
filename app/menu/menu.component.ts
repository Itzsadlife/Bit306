import { Component, OnInit } from '@angular/core';
import { ProductType } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  productTypes: ProductType[] = [];

  constructor(private productService: ProductService) { }

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
  }
    getImageUrl(product): string {
    const filename = product.imageUrl.split('/').pop();
    return `http://localhost:3000/uploads/${filename}`;
  }
  
}


