import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{

  cartItems: any[] = [];
  total = 0;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  removeItem(productId: string): void {
    this.cartService.removeItemById(productId);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }


  clearCart(): void {
    this.cartItems = [];
    this.cartService.clearCart();
    this.total = 0;
  }
}


