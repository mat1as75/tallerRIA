import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../services/cookies/cookie.service';
import { CartService } from '../../services/cart/cart.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  private serviceCookie = inject(CookieService)
  private cartService = inject(CartService)
  private localStorageService = inject(LocalStorageService)

  sessionId?: number | undefined
  quantityProductsCart: number = 0

  constructor(private router: Router) {}

  ngOnInit(): void {
    const cookieValue = this.serviceCookie.getCookie('session_ID') || localStorage.getItem('session_ID');

    const parsedId = Number(cookieValue);
    this.sessionId = !isNaN(parsedId) && parsedId > 0 ? parsedId : undefined;

    if (this.sessionId) {
      this.cartService.updateQuantity(this.sessionId);
    }

    this.cartService.quantity$.subscribe(count => {
      this.quantityProductsCart = count;
    });

    console.log('SESSION_ID: ' + this.sessionId);
  }

  checkCookieRedirect(url: string) {
    const session = this.serviceCookie.getCookie('session_ID');
    this.localStorageService.setItem('session_ID', session || '');
    console.log('Cookie leída:', session);
    if (session) {
      this.router.navigate([`/${url}`]);
    } else {
      this.router.navigate(['/login']);
    }
  } 

}