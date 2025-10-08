import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class CartService {

  private cartItems: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  private productInCartState: Set<string> = new Set(); // Set para almacenar IDs de productos en el carrito


  constructor() {
    // Recuperar carrito desde localStorage al iniciar
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.cartItems = JSON.parse(stored);
      this.cartItems.forEach(item => this.productInCartState.add(item.id));
      this.cartCount.next(this.cartItems.length);
    }
  }
  

  isProductInCart(id: string): boolean {
    return this.productInCartState.has(id); // Retornar si el producto está en el set
  }

  getCartItems(): any [] {
    return this.cartItems;
  }
  

  //persistencia localstorage
  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }


  addToCart(item: any): void {
    const exists = this.cartItems.some(p => p.id === item.id);
    if (!exists) {
      this.cartItems.push(item);
      this.cartCount.next(this.cartItems.length);
      this.productInCartState.add(item.id);  // Agregar el ID al set
      this.saveToStorage();  //localStorage
    }
  }

  removeItemById(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.cartCount.next(this.cartItems.length);
    this.productInCartState.delete(productId); // Eliminar del set

    this.saveToStorage(); //localstorage

  }

  clearCart(): void {
    this.cartItems = [];
    this.cartCount.next(0);
    this.productInCartState.clear(); // Limpiar el set

    localStorage.removeItem('cart'); //localstorage
  }

}


