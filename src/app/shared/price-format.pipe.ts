import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number | string, currency: string = 'USD'): string {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(number)) return '';
    return `${currency} ${number.toFixed(2)}`;
  }
}