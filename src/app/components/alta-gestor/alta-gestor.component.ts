import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-alta-gestor',
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './alta-gestor.component.html',
  styleUrl: './alta-gestor.component.scss'
})
export class AltaGestorComponent {

}
