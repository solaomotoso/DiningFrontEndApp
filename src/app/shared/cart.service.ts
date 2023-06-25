// cart.service.ts


import { Injectable, EventEmitter } from '@angular/core';
// import { CartItem } from '../shared/cart.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  unit: number;
  amount: number;
  paymentMode: string;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'https://localhost:7146/PaymentDetails';
  private cartItems: CartItem[] = [];
  public cartUpdated: EventEmitter<CartItem[]> = new EventEmitter<CartItem[]>();


  fetchUserPaymentDetails(userId: string): Observable<any> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get(url);
  }

  constructor(private http: HttpClient) { }

  getUserPaymentDetails(userId: string): Observable<any> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get(url);
  }

  addToCart(item: CartItem): void {
    if (this.cartItems.length === 0) {
      this.cartItems = [item];
    } else {
      this.cartItems.push(item);
    }
    this.cartUpdated.emit(this.cartItems);
  }

  removeItem(item: CartItem): void {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartUpdated.emit(this.cartItems);
    }
  }


  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartUpdated.emit(this.cartItems);
  }


}
