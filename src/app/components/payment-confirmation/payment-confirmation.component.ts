import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-payment-confirmation',
  imports: [],
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.scss'
})
export class PaymentConfirmationComponent implements OnInit {
  private orderService = inject(OrderService)
  private localStorageService = inject(LocalStorageService)

  confirmationData: any
  email = 'mnjtecno@tallerphp.uy'

  ngOnInit(): void {
    const storedData = this.localStorageService.getItem('lastConfirmation')
    if (storedData)
      this.confirmationData = typeof storedData === 'string' ? JSON.parse(storedData) : storedData
  }

  downloadPDF() {
    if (!this.confirmationData) return

    this.orderService.downloadOrderPDF(this.confirmationData)
    .subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedido_${this.confirmationData.ID_Pedido}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: error => {
        console.error('Error al descargar el PDF', error);
      }
    })
  }

}
