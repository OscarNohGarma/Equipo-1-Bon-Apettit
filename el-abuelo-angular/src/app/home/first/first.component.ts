import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { MenuProduct } from '../../core/models/menuProduct';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './first.component.html',
  styleUrl: './first.component.scss',
})
export class FirstComponent implements OnInit {
  productItems: MenuProduct[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe((data) => {
      this.productItems = data;
    });
  }

  esPositivo: boolean = true;

  alternarEstado() {
    this.esPositivo = !this.esPositivo;
  }

  getProducts() {
    console.log(this.productItems);
  }
}
