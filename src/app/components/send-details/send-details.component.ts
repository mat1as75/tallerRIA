import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-send-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './send-details.component.html',
  styleUrl: './send-details.component.scss'
})
export class SendDetailsComponent {

  ddepartaments: string[] = [
    'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
    'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
    'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
    'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
  ];

}
