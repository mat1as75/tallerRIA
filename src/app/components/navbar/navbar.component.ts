import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../services/cookies/cookie.service';
import { CartService } from '../../services/cart/cart.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { SearchService } from '../../services/search/search.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/Category.interface';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  private serviceCookie = inject(CookieService)
  private cartService = inject(CartService)
  private localStorageService = inject(LocalStorageService)
  private searchService = inject(SearchService)
  private productService = inject(ProductService)

  sessionId?: number | undefined
  quantityProductsCart: number = 0
  searchText = ''

  showCategoryList: boolean = false
  categories: Category[] = []

  @ViewChild('menuContainer') menuContainerRef!: ElementRef

  constructor(private router: Router, private eRef: ElementRef) {}

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

  onSearch() {
    this.searchService.setSearchTerm(this.searchText)
    this.router.navigate(['/catalogo'])
    this.searchText = ''
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error cargando categorias ', err)
    })
  }

  toggleCategoryMenu() {
    this.showCategoryList = !this.showCategoryList
    if (this.showCategoryList && this.categories.length === 0)
      this.loadCategories()
  }

  navigateToCategory(categoryId: number | null) {
    this.searchService.setSearchTerm('')

    if (categoryId === null)
      this.router.navigate(['/catalogo'], { queryParams: {} })
    else
      this.router.navigate(['/catalogo'], { queryParams: { categoryId: categoryId } })

    this.showCategoryList = false
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.menuContainerRef?.nativeElement.contains(event.target)) {
      this.showCategoryList = false;
    }
  }
}