import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from '../../services/cookies/cookie.service';
import { CartService } from '../../services/cart/cart.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { SearchService } from '../../services/search/search.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/Category.interface';
import { ProductService } from '../../services/product/product.service';
import { UserServiceService } from '../../services/user/user-service.service';
import { User } from '../../interfaces/User.interface';
import { Offcanvas } from 'bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  private serviceCookie = inject(CookieService)
  private cartService = inject(CartService)
  private localStorageService = inject(LocalStorageService)
  private searchService = inject(SearchService)
  private productService = inject(ProductService)

  sessionId?: number | undefined;
  
  //ROL DEL USUARIO
  rolUsuario: string = '';

  //PERMISOS SI ES GESTOR
  esAdmin: boolean = false;
  esGestor: boolean = false;
  






  quantityProductsCart: number = 0;
  searchText = '';

  tipo = '';

  showMobileMenu: boolean = false;
  showCategoryList: boolean = false;
  categories: Category[] = [];

  
  //USUARIO
  usuario: User | null = null; 

  @ViewChild('menuContainer') menuContainerRef!: ElementRef;

  constructor(
    
    
    private router: Router,
    private eRef: ElementRef, 
    private servicecookie: CookieService, 
    private userservice: UserServiceService


  ){}

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

    //SI HAY ALGUIEN CONECTADO PREGUNTAR POR DATOS
    const session = this.serviceCookie.getCookie('session_ID');

    // ESTA CONECTADO
    if (session) {
        this.userservice.ObtenerUsuario(session).subscribe({
      next: (userData) => {
        this.usuario = userData; 

        //SET ROL en localstorage
        this.localStorageService.setItem('Rol', this.usuario.Rol);

        console.log("Datos del usuario:", userData);
      },
      error: (err) => {
        console.error("Error al obtener el usuario:", err);
        this.router.navigate(['/login']);
      }
    });
      


    }



    //OBTENER ROL DEL USUARIO
    const rol = localStorage.getItem('Rol');
    if (rol) {
      try {
        const parsedRol = JSON.parse(rol);
        this.rolUsuario = parsedRol?.toLowerCase() || '';
      } catch (e) {
        console.error('Error al parsear el Rol del usuario del localStorage', e);
      }
    }

    console.log('SESSION_ID: ' + this.sessionId);
    console.log('ROL USUARIO:', this.rolUsuario);

    this.esAdminOGestor();
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
    this.searchText = ''

    const closeBtn = document.querySelector('#mobileMenu .btn-close') as HTMLElement
    if (closeBtn)
      closeBtn.click()

    this.router.navigate(['/catalogo'])
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error cargando categorias ', err)
    })
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu
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

  esAdminOGestor(): boolean {
    this.tipo = this.rolUsuario;

    if(this.rolUsuario === 'administrador' ){

      this.tipo = 'Administrar';
      this.esAdmin = true;
      return true;

    }else if(this.rolUsuario === 'gestor'){

      this.tipo = 'Gestionar';
      this.esGestor = true;

      return true;

    }

    return false;

  }






}