import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Order } from '../../interfaces/Order.interface';
import { OrderService } from '../../services/order/order.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/Product.interface';
import { UserServiceService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService)
  private userService = inject(UserServiceService)

  orders: Order[] = []
  productsByOrderId: Record<number, Product[]> = {}
  isAscending: boolean = true
  currentPage: number = 1;
  itemsPerPage: number = 10;

  hideTimeout: any
  hoveredOrderId: number | null = null

  constructor(private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        const pendingOrders = data.filter((orders) => orders.Estado === 'pendiente')
        this.orders = pendingOrders
      },
      error: (err) => {
        console.error('Error al obtener pedidos', err)
      }
    })
  }

  getProductsByOrder(id: number) {
    if (!this.productsByOrderId[id]) {
      this.orderService.getProductsByOrderId(id).subscribe({
        next: (data) => {
          this.productsByOrderId[id] = data
          console.log('PRODUCTS: ', data)
          this.cd.detectChanges()
        },
        error: (err) => {
          console.error('Error al obtener los productos de un pedido', err)
        }
      })
    }
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage)
  }

  paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage
    return this.orders.slice(start, start + this.itemsPerPage)
  }

  editOrder(id: number) {
    this.router.navigate(['/modificarPedido', id])
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages)
      this.currentPage = page;
  }

  handleMouseEnter(orderId: number) {
    if (this.hideTimeout)
      clearTimeout(this.hideTimeout)

    this.hoveredOrderId = orderId
    this.getProductsByOrder(orderId)
  }

  hideProductDetails() {
    this.hoveredOrderId = null
  }

  clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
